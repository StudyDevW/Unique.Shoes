using Microsoft.Extensions.Logging;
using unique.shoes.middleware.Services;
using Unique.Shoes.Middleware.Broker.DTO;
using Unique.Shoes.Middleware.Database.DBO;
using Unique.Shoes.Middleware.Database.DTO;
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

        public List<Pay_Out> OutPay(string hashPay)
        {
            List<Pay_Out> payToPrint = new List<Pay_Out>();

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var paymentOrder = db.payTableObj.Where(c => c.hashPay == hashPay).ToList();

                if (paymentOrder != null) {
                    for (int i = 0; i < paymentOrder.Count(); i++)
                    {
                        Pay_Out payFind = new Pay_Out()
                        {
                            payStatus = paymentOrder[i].payStatus,
                            hashPay = hashPay,
                            date = paymentOrder[i].date,
                            cardNumber = paymentOrder[i].cardNumber
                        };

                        payToPrint.Add(payFind);
                    }
                   

                    return payToPrint;
                }   
                else
                {
                    throw new Exception("Заказ не найден!");
                }
            }
        }


        public async Task Pay(string cardNumber, string cvv, string hashPay)
        {

            if (_cache.CheckExistKeysStorage<MarketToPaymentMQ>($"rabbit_{hashPay}"))
            {
                var operationHash = _cache.GetKeyFromStorage<MarketToPaymentMQ>($"rabbit_{hashPay}");

                if (operationHash.price > 0)
                {
                    using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
                    {
                        var cardBank = db.bankCardTableObj.Where(c => c.cardNumber == cardNumber && c.cvv == cvv).FirstOrDefault();

                        if (cardBank != null && cardBank.moneyValue >= operationHash.price)
                        {
                            cardBank.moneyValue -= operationHash.price;
                            await db.SaveChangesAsync();

                            PayTable payTable = new PayTable()
                            {
                                hashPay = hashPay,
                                payStatus = "success",
                                date = DateTime.UtcNow,
                                cardNumber = cardNumber
                            };

                            db.payTableObj.Add(payTable);
                            await db.SaveChangesAsync();

                            _logger.LogInformation($"Заказ {hashPay}, успешно оплачен!");

                            _rabbit.SendMessage<PayTable>(
                                payTable, "payment_queue_response");

                            _logger.LogInformation($"Заказ {hashPay} был отправлен в очередь payment_queue_response");

                            _cache.DeleteKeyFromStorage($"rabbit_{hashPay}");

                        }
                        else if (cardBank != null && cardBank.moneyValue < operationHash.price)
                        {
                            PayTable payTable = new PayTable()
                            {
                                hashPay = hashPay,
                                payStatus = "money_not_exist",
                                date = DateTime.UtcNow,
                                cardNumber = cardNumber
                            };

                            db.payTableObj.Add(payTable);
                            await db.SaveChangesAsync();

                            _logger.LogInformation($"Заказ {hashPay}, оплата не прошла! (Недостаточно средств)");

                            _rabbit.SendMessage<PayTable>(
                                payTable, "payment_queue_response");

                            _logger.LogInformation($"Заказ {hashPay} был отправлен в очередь payment_queue_response");

                            throw new Exception("Заказ не оплачен!");
                        }
                        else
                        {
                            PayTable payTable = new PayTable()
                            {
                                hashPay = hashPay,
                                payStatus = "failed",
                                date = DateTime.UtcNow,
                                cardNumber = cardNumber
                            };

                            db.payTableObj.Add(payTable);
                            await db.SaveChangesAsync();

                            _logger.LogInformation($"Заказ {hashPay}, оплата не прошла!");

                            _rabbit.SendMessage<PayTable>(
                                payTable, "payment_queue_response");

                            _logger.LogInformation($"Заказ {hashPay} был отправлен в очередь payment_queue_response");

                            throw new Exception("Заказ не оплачен!");
                           
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
