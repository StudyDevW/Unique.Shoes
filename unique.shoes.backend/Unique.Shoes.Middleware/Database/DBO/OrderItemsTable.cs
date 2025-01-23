using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DBO
{
    public class OrderItemsTable
    {
        [Key]
        public int id { get; set; }

        public string hashPay { get; set; }

        public string hashName { get; set; }

        public string size { get; set; }

        public int count { get; set; }
    }
}
