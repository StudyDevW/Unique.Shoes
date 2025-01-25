using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Pay_Out
    {
        public string hashPay {  get; set; }

        public string payStatus { get; set; }

        public string cardNumber { get; set; }

        public DateTime date { get; set; }

    }
}
