using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using unique.shoes.middleware.Services;
using Unique.Shoes.MarketAPI.Model.Services;
using Unique.Shoes.Middleware.Broker.DTO;
using Unique.Shoes.Middleware.Services;

namespace Unique.Shoes.MarketAPI.Model.RabbitMQ
{
    public class IRabbitMQListener : IRabbitMQListenerService
    {
        private readonly IDatabaseService _database;
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly ILogger _logger;
        private readonly ICacheService _cache;
        public IRabbitMQListener(IDatabaseService database, ICacheService cache)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("RabbitMQListener | rabbit-sdk-logger");
            _cache = cache;
            _database = database;
        }

        private void OrderCheck(string hashPay)
        {
            if (_cache.CheckExistKeysStorage<PaymentToMarketMQ>($"rabbit_response_{hashPay}"))
            {
                var responseHash = _cache.GetKeyFromStorage<PaymentToMarketMQ>($"rabbit_response_{hashPay}");

                if (responseHash.payStatus == "success")
                {
                    _database.OrderFinal(responseHash.hashPay);

                    _logger.LogInformation($"Заказ {responseHash.hashPay} отмечен как оплаченный");

                    _cache.DeleteKeyFromStorage($"rabbit_response_{hashPay}");

                    _logger.LogInformation($"Запись {responseHash.hashPay} удалена из кэша");
                }
                else if (responseHash.payStatus == "failed" || responseHash.payStatus == "money_not_exist")
                {
                    _logger.LogInformation($"Заказ {responseHash.hashPay} отмечен как неоплаченный!");

                    _cache.DeleteKeyFromStorage($"rabbit_response_{hashPay}");

                    _logger.LogInformation($"Запись {responseHash.hashPay} удалена из кэша");
                }
            }
        }

        public void ListenMarket()
        {
            var rabbit = new ConnectionFactory()
            {
                HostName = "rabbitmq_broker",
                Port = 5672
            };
            var _connection = rabbit.CreateConnection();
            var _channel = _connection.CreateModel();

            _channel.QueueDeclare(queue: "payment_queue_response",
                       durable: true,
                       exclusive: false,
                       autoDelete: false,
                       arguments: null);

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (ch, eventArgs) =>
            {
                var message = Encoding.UTF8.GetString(eventArgs.Body.ToArray());

                _logger.LogInformation($"payment_queue_response: получен ответ {message}");

                var jsonBack = JsonSerializer.Deserialize<PaymentToMarketMQ>(message);

                if (jsonBack != null)
                {
                    _cache.WriteKeyInStorageObject<PaymentToMarketMQ>($"rabbit_response_{jsonBack.hashPay}", jsonBack, DateTime.UtcNow.AddDays(30));
                    _logger.LogInformation($"payment_queue_response: ответ записан в redis");

                    //Проверяем заказ
                    OrderCheck(jsonBack.hashPay);
                }
            };

            _channel.BasicConsume("payment_queue_response", true, consumer);
        }

    }
}
