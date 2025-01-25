using Unique.Shoes.Middleware.Database.DTO;
using Unique.Shoes.Middleware.Database.DTO.ShopCart;

namespace Unique.Shoes.MarketAPI.Model.Services
{
    public interface IDatabaseService
    {
        public Task CreateItem(Item_Create dto);

        public List<string> GetAllPaymentHashes(int userId);

        public List<Item_Get> GetAllItems();

        public Task AddImages(string[] imageLinks, string itemName);

        public List<string> GetImages(int itemId);

        public Task DeleteItem(int idItem);

        public Task AddItemShopCart(ShopCart_Add dtoObj);

        public ShopCart_GetAll GetShopCartItems(int idUser);

        public Task ChangeItemShopCart(int cartId, ShopCart_Change dtoObj);

        public Task DeleteItemShopCart(int cartId);

        public bool ExistItemShopCart(string hashName, int userId);

        public Task<string> AddOrderUser(Pay_Order dtoObj);

        public Task OrderFinal(string hashPay);

        public Order_All OrderAll(int userId);
    }
}
