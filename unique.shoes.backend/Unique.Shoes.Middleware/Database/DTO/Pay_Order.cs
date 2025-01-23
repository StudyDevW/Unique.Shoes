using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Pay_Order
    {
        public int userId { get; set; }

        public string deliveryAddress { get; set; }

        public int price { get; set; }

        public List<Pay_OrderMore> items { get; set; }
    }
}
