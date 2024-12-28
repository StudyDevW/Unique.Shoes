using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Database.DTO.AccountSelect
{
    public class Accounts_GetAll
    {
        public Accounts_SelectionSettings Settings { get; set; }

        public List<Accounts_Info> Content { get; set; }

        public void ContentFill(List<Accounts_Info> listOut)
        {
            Content = listOut;
        }
    }
}
