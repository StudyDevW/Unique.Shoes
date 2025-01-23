using Microsoft.Extensions.Logging;
using unique.shoes.middleware.Services;
using Unique.Shoes.Middleware.Broker.DTO;
using Unique.Shoes.Middleware.Database.DBO;
using Unique.Shoes.Middleware.Services;
using Unique.Shoes.PaymentAPI.Model.Services;

namespace Unique.Shoes.PaymentAPI.Model.Database
{
    public class DatabaseSDK : IDatabaseService
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _conf;
        private readonly ICacheService _cache;
        private readonly IRabbitMQService _rabbit;

        public DatabaseSDK(IConfiguration configuration, ICacheService cache, IRabbitMQService rabbit)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("PaymentAPI | database-sdk-logger");
            _conf = configuration;
            _cache = cache;
            _rabbit = rabbit;
        }

        private bool CardCheck(string cardNumber, string cvv)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                foreach (var dbobj in db.bankCardTableObj)
                {
                    if (dbobj.cardNumber == cardNumber && dbobj.cvv == cvv)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task Pay(string cardNumber, string cvv, string hashPay)
        {
            if (!CardCheck(cardNumber, cvv))
            {
                throw new Exception("Card invalid!");
            }

            if (_cache.CheckExistKeysStorage<MarketToPaymentMQ>($"rabbit_{hashPay}"))
            {
                var operationHash = _cache.GetKeyFromStorage<MarketToPaymentMQ>($"rabbit_{hashPay}");

                if (operationHash.price > 0)
                {
                    using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
                    {
                        var cardBank = db.bankCardTableObj.Where(c => c.cardNumber == cardNumber && c.cvv == cvv).FirstOrDefault();

                        if (cardBank != null)
                        {
                            cardBank.moneyValue -= operationHash.price;
                            await db.SaveChangesAsync();

                            PayTable payTable = new PayTable()
                            {
                                hashPay = hashPay,
                                payStatus = "success",
                                date = DateTime.UtcNow
                            };

                            db.payTableObj.Add(payTable);
                            await db.SaveChangesAsync();

                            _logger.LogInformation($"Заказ {hashPay}, успешно оплачен!");

                            _rabbit.SendMessage<PayTable>(
                                payTable, "payment_queue_response");

                            _logger.LogInformation($"Заказ {hashPay} был отправлен в очередь payment_queue_response");

                            _cache.DeleteKeyFromStorage($"rabbit_{hashPay}");

                        }
                        else
                        {
                            PayTable payTable = new PayTable()
                            {
                                hashPay = hashPay,
                                payStatus = "failed",
                                date = DateTime.UtcNow
                            };

                            db.payTableObj.Add(payTable);
                            await db.SaveChangesAsync();

                            _logger.LogInformation($"Заказ {hashPay}, оплата не прошла!");

                            _rabbit.SendMessage<PayTable>(
                                payTable, "payment_queue_response");

                            _logger.LogInformation($"Заказ {hashPay} был отправлен в очередь payment_queue_response");
                        }
                    }
                }

          
            }

            //var requestMessage = _rabbit.GetMessage($"request_queue_{hashPay}");

            //_logger.LogInformation("Полученное сообщение: " + requestMessage);

            //if (requestMessage != "")
            //{
            //    _logger.LogInformation(requestMessage);

            //    int price;
            //    int.TryParse(string.Join("", requestMessage.Where(c => char.IsDigit(c))), out price);

            //    if (price > 0)
            //    {

            //        using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            //        {
            //            var cardBank = db.bankCardTableObj.Where(c => c.cardNumber == cardNumber && c.cvv == cvv).FirstOrDefault();
                    
            //            if (cardBank != null)
            //            {
            //                cardBank.moneyValue -= price;
            //                await db.SaveChangesAsync();

            //                PayTable payTable = new PayTable() {
            //                    hashPay = hashPay,
            //                    payStatus = "success",
            //                    date = DateTime.Now
            //                };

            //                db.payTableObj.Add(payTable);
            //                await db.SaveChangesAsync();

            //                _logger.LogInformation($"Заказ {hashPay} успешно оплачен!");
            //            }
            //        }

            //        _rabbit.DeleteQueue($"request_queue_{hashPay}");

            //        _logger.LogInformation($"Очередь request_queue_{hashPay} удалена!");

            //        _rabbit.SetupSend($"order_payed_success", $"response_queue_{hashPay}");

            //        _logger.LogInformation($"Очередь response_queue_{hashPay} открыта!");
            //    }

          //  }
        }

    }
}
