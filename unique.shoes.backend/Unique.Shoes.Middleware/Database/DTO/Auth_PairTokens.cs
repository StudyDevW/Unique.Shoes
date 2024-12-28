using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Auth_PairTokens
    {
        public string? accessToken { get; set; }

        public string? refreshToken { get; set; }
    }
}
