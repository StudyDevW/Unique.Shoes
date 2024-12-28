using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Auth_SignUp
    {
        public string? lastName { get; set; }

        public string? firstName { get; set; }

        public string? username { get; set; }

        public string? password { get; set; }
    }
}
