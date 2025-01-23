using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DBO
{
    public class OrderTable
    {
        [Key]
        public string hashPay { get; set; }

        public int userId { get; set; }

        public string status { get; set; }

        public int price { get; set; }

        public string deliveryStatus { get; set; }

        public string deliveryAddress { get; set; }
    }
}
