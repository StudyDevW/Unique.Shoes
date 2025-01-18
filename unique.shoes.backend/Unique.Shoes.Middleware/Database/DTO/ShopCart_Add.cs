using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class ShopCart_Add
    {
        public int userId { get; set; }

        public string hashName { get; set; }

        public int countItem { get; set; }

        public string size { get; set; }
    }
}
