using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Broker.DTO
{
    public class MarketToPaymentMQ
    {
        public string hashPay { get; set; }

        public int price { get; set; }
    }
}
