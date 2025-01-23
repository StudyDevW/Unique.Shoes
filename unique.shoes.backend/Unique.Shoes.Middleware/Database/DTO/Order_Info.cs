using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Order_Info
    {
        public string hashPay { get; set; }

        public string payStatus { get; set; }

        public string deliveryStatus { get; set; }

        public string deliveryAddress { get; set; }

        public int price { get; set; }

        public List<Order_Item> items { get; set; }
    }
}
