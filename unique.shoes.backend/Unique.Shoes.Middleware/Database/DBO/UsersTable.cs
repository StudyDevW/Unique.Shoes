using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace unique.shoes.middleware.Database.DBO
{
    public class UsersTable
    {
        [Key]
        public int id { get; set; }
        public string? firstName { get; set; }

        public string? lastName { get; set; }

        public string? username { get; set; }

        public string? password { get; set; }

        public string[]? roles { get; set; }
    }
}
