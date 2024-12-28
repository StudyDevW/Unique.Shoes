using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Accounts_Info
    {
        public int id { get; set; }

        public string? lastName { get; set; }

        public string? firstName { get; set; }

        public List<string>? roles { get; set; }
    }
}
