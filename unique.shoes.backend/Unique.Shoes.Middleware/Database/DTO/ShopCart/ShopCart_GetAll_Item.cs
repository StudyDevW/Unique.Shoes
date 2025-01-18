using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO.ShopCart
{
    public class ShopCart_GetAll_Item
    {
        public int id { get; set; }

        public int itemId { get; set; }

        public string hashName { get; set; }

        public string name { get; set; }

        public int price { get; set; }

        public int countItem { get; set; }

        public string size { get; set; }

        public string? imageLink { get; set; }
    }
}
