namespace Unique.Shoes.PaymentAPI.Model.Services
{
    public interface IDatabaseService
    {
        public Task Pay(string cardNumber, string cvv, string hashPay);
    }
}
