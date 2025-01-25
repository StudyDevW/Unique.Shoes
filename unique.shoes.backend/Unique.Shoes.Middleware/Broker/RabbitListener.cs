using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using unique.shoes.middleware.Services;
using Unique.Shoes.Middleware.Services;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Unique.Shoes.Middleware.Broker.DTO;

namespace Unique.Shoes.Middleware.Broker
{
    public class RabbitListener : IRabbitListenerService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly ILogger _logger;
        private readonly ICacheService _cache;
        public RabbitListener(ICacheService cache)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("RabbitMQListener | rabbit-sdk-logger");
            _cache = cache;
        }

        public void ListenPayment()
        {
            var rabbit = new ConnectionFactory()
            {
                HostName = "rabbitmq_broker",
                Port = 5672
            };
            var _connection = rabbit.CreateConnection();
            var _channel = _connection.CreateModel();

            _channel.QueueDeclare(queue: "payment_queue_request",
                       durable: true,
                       exclusive: false,
                       autoDelete: false,
                       arguments: null);

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (ch, eventArgs) =>
            {
                var message = Encoding.UTF8.GetString(eventArgs.Body.ToArray());

                _logger.LogInformation($"payment_queue_request: получено сообщение {message}");

                var jsonBack = JsonSerializer.Deserialize<MarketToPaymentMQ>(message);

                if (jsonBack != null)
                {
                    _cache.WriteKeyInStorageObject<MarketToPaymentMQ>($"rabbit_{jsonBack.hashPay}", jsonBack, DateTime.UtcNow.AddDays(7));
                    _logger.LogInformation($"payment_queue_request: сообщение записано в redis");
              
                    
                }
            };

            _channel.BasicConsume("payment_queue_request", true, consumer);
        }

        


        //private void GetMessageFromAction(string queue_name)
        //{
        //    _channel.QueueDeclare(queue: queue_name,
        //               durable: false,
        //               exclusive: false,
        //               autoDelete: false,
        //               arguments: null);
        //    var consumer = new EventingBasicConsumer(_channel);
        //    consumer.Received += (ch, eventArgs) =>
        //    {
        //        var content = Encoding.UTF8.GetString(eventArgs.Body.ToArray());
        //        MessageOperation(queue_name, content).Start();
        //        _channel.BasicAck(eventArgs.DeliveryTag, false);
        //    };
        //    _channel.BasicConsume(queue_name, false, consumer);
        //}
        //private async Task MessageOperation(string queue_name, string content)
        //{
        //    if (queue_name == "validation_queue")
        //    {
        //        await ValidationRequest(content);
        //    }
        //}
        //private async Task ValidationRequest(string message)
        //{

        //    Rabbit_Validation rabbitNotValid = new Rabbit_Validation()
        //    {
        //        token = message,
        //        status = "not_valid"
        //    };
        //    Rabbit_Validation rabbitValid = new Rabbit_Validation()
        //    {
        //        token = message,
        //        status = "valid"
        //    };
        //    var validation = await _jwt.AccessTokenValidation(message);
        //    if (validation.TokenHasError())
        //    {
        //        _rabbitmq.SendMessageObj(rabbitNotValid, "validation_queue_response");
        //    }
        //    else if (validation.TokenHasSuccess())
        //    {
        //        _rabbitmq.SendMessageObj(rabbitValid, "validation_queue_response");
        //    }
        //}
        public void Close()
        {
            _channel.Close();
            _connection.Close();
        }
    }
}
