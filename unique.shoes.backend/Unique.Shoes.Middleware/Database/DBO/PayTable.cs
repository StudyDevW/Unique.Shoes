using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DBO
{
    public class PayTable
    {
        [Key]
        public int id { get; set; }

        public int idOrder { get; set; }

        public string payStatus { get; set; }

        public DateTime date { get; set; }

    }
}
