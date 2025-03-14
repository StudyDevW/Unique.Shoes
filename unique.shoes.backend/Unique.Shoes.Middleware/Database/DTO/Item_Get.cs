﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO
{
    public class Item_Get
    {
        public int id { get; set; }

        public string hashName { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string[]? flags { get; set; }

        public int price { get; set; }

        public bool count { get; set; }

        public string[]? sizes { get; set; }

        public string[]? imagePaths { get; set; }
    }
}
