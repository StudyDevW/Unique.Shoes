using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unique.Shoes.Middleware.Broker.DTO;

namespace Unique.Shoes.Middleware.Services
{
    public interface IRabbitMQService
    {
        public void SendMessage<T>(T message, string queue_name);
        //public string GetMessage(string queue_name);
        //public void OpenQueue(string queue_name);
        //public void DeleteQueue(string queue_name);
    }
}
