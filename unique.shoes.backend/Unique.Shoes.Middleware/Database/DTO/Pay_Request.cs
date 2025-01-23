using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Pay_Request
    {
        public string hashPay { get; set; }

        public string cardNumber { get; set; }

        public string cvv { get; set; }
    }
}
