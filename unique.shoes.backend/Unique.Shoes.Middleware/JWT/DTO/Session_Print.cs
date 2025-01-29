using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.JWT.DTO
{
    public class Session_Init
    {

        public DateTime? timeAdd { get; set; }

        public DateTime? timeUpd { get; set; }

        public DateTime? timeDel { get; set; }

        public string tokenSession { get; set; }

        public string statusSession { get; set; }

    }
}
