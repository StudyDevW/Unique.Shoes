using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO.ShopCart
{
    public class ShopCart_GetAll
    {
        public ShopCart_GetAll_Info? shopCartInfo { get; set; }

        public List<ShopCart_GetAll_Item>? shopCartItem { get; set; }

    }
}
