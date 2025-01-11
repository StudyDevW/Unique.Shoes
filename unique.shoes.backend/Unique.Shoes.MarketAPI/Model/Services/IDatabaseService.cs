using Unique.Shoes.Middleware.Database.DTO;

namespace Unique.Shoes.MarketAPI.Model.Services
{
    public interface IDatabaseService
    {
        public Task CreateItem(Item_Create dto);

        public List<Item_Get> GetAllItems();

        public Task AddImages(string[] imageLinks, string itemName);

        public List<string> GetImages(int itemId);

        public Task DeleteItem(int idItem);
    }
}
