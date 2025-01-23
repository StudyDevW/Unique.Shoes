using Microsoft.AspNetCore.Connections;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Unique.Shoes.Middleware.Broker.DTO;
using Unique.Shoes.Middleware.Services;

namespace Unique.Shoes.Middleware.Broker
{
    public class RabbitSDK : IRabbitMQService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        public RabbitSDK()
        {
            var rabbit = new ConnectionFactory()
            {
                HostName = "rabbitmq_broker",
                Port = 5672
            };
            _connection = rabbit.CreateConnection();
            _channel = _connection.CreateModel();
        }

        public void SendMessage<T>(T message, string queue_name)
        {
            _channel.QueueDeclare(queue: queue_name,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            var jsonString = JsonSerializer.Serialize(message);

            var body = Encoding.UTF8.GetBytes(jsonString);

            _channel.BasicPublish(exchange: "",
                           routingKey: queue_name,
                           basicProperties: null,
                           body: body);
        }

        //public string GetMessage(string queue_name)
        //{
        //    _channel.QueueDeclare(queue: queue_name,
        //                durable: false,
        //                exclusive: false,
        //                autoDelete: false,
        //                arguments: null);

        //    string consumed_messages = "";
        //    var consumer = new EventingBasicConsumer(_channel);
        //    consumer.Received += (ch, eventArgs) =>
        //    {
        //        var body = eventArgs.Body.ToArray();
        //        var content = Encoding.UTF8.GetString(body);
        //        consumed_messages = content;
        //        //_channel.BasicAck(eventArgs.DeliveryTag, false);
        //    };

        //    _channel.BasicConsume(queue: queue_name,
        //                     autoAck: true,
        //                     consumer: consumer);

        //    return consumed_messages;
        //}
    }
}
