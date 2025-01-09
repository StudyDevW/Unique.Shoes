using System.Security.Cryptography;
using System.Text;
using unique.shoes.middleware.Database.DBO;
using Unique.Shoes.MarketAPI.Model.Services;
using Unique.Shoes.Middleware.Database.DBO;
using Unique.Shoes.Middleware.Database.DTO;

namespace Unique.Shoes.MarketAPI.Model.Database
{
    public class DatabaseSDK : IDatabaseService
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _conf;

        public DatabaseSDK(IConfiguration configuration)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger(string.Empty);
            _conf = configuration;

        }

        private static string GenerateMD5Hash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                StringBuilder sb = new StringBuilder();
                foreach (byte b in hashBytes)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }

        public async Task CreateItem(Item_Create dto)
        {
            if (dto == null)
            {
                _logger.LogError("CreateItem: dto==null");
                return;
            }

            ShopItemsTable shopItemsTable = new ShopItemsTable()
            {
                hashName = GenerateMD5Hash(dto.name),
                name = dto.name,
                description = dto.description,
                flags = dto.flags,
                count = dto.count,
                price = dto.price,
                imageLink = dto.imageLink,
                sizes = dto.sizes
            };

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                db.shopItemsTableObj.Add(shopItemsTable);
                await db.SaveChangesAsync();

                _logger.LogInformation($"CreateItem: {dto.name}, created");
            }
        }
    }
}
