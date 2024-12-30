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
        public int id { get; set; }

        public int userId { get; set; }

        public string hashName { get; set; }

        public string status { get; set; }

        public string deliveryStatus { get; set; }

    }
}
