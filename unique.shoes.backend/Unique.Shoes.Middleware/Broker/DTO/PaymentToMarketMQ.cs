using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Broker.DTO
{
    public class PaymentToMarketMQ
    {
        public int id {  get; set; }

        public string hashPay { get; set; }

        public string payStatus { get; set; }

        public DateTime date { get; set; }
    }
}
