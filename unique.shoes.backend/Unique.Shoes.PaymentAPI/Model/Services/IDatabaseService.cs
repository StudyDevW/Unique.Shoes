using Unique.Shoes.Middleware.Database.DTO;

namespace Unique.Shoes.PaymentAPI.Model.Services
{
    public interface IDatabaseService
    {
        public List<Pay_Out> OutPay(string hashPay);

        public Task Pay(string cardNumber, string cvv, string hashPay);
    }
}
