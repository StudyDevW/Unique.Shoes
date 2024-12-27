using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace unique.shoes.middleware.JWT.DTO.Token
{
    public class Token_ValidSuccess
    {
        public int Id { get; set; }

        public string? userName { get; set; }

        public List<string>? userRoles { get; set; }

        public string? bearerWithoutPrefix { get; set; }
    }
}
