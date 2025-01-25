using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Unique.Shoes.Middleware.Services
{
    public interface IRabbitListenerService
    {
        public void ListenPayment();
        public void Close();
    }
}
