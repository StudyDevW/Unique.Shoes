using Unique.Shoes.Middleware.Database.DTO;

namespace Unique.Shoes.MarketAPI.Model.Services
{
    public interface IDatabaseService
    {
        public Task CreateItem(Item_Create dto);
    }
}
