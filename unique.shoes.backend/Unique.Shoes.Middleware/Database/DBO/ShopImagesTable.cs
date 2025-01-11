using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DBO
{
    public class ShopImagesTable
    {
        [Key]
        public int id { get; set; }

        public int itemId { get; set; } 

        public string? imageLink { get; set; }

    }
}
