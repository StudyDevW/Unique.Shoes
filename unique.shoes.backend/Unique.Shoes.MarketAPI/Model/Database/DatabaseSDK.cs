using System.Collections.Immutable;
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
                sizes = dto.sizes
            };

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                db.shopItemsTableObj.Add(shopItemsTable);
                await db.SaveChangesAsync();

                _logger.LogInformation($"CreateItem: {dto.name}, created");
            }
        }

        private List<string> GetImagesFromPath(int itemId, DataContext _db)
        {
            List<string> outputImages = new List<string>();

            try
            {
                foreach (var imageObj in _db.shopImagesTableObj)
                {
                    if (imageObj.itemId == itemId)
                    {
                        if (imageObj.imageLink != null)
                            outputImages.Add(imageObj.imageLink);
                    }
                }

                return outputImages;
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"GetImagesFromPath: Error {ex.Message}");

                return outputImages;
            }
        }

        public List<string> GetImages(int itemId)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var images = GetImagesFromPath(itemId, db);

                if (images != null)
                    return images; 
            }

            return new List<string>();
        }

        private void DeleteImageFromPath(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            else
            {
                _logger.LogError($"DeleteImageFromPath: file {filePath} not found");
            }
        }

        public async Task DeleteItem(int idItem)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var itemToDelete = db.shopItemsTableObj.Where(c=>c.id == idItem).FirstOrDefault();

                var imagesToDelete = db.shopImagesTableObj.Where(c=>c.itemId == idItem);
              
                if (itemToDelete != null)
                {
                    var idItemLog = itemToDelete.id;
                
                    db.shopItemsTableObj.Remove(itemToDelete);
                    await db.SaveChangesAsync();
                    _logger.LogInformation($"DeleteItem: {idItemLog} item deleted");

                    if (imagesToDelete != null) {
                
                        while (imagesToDelete.Count() > 0)
                        {
                            DeleteImageFromPath(imagesToDelete.FirstOrDefault().imageLink);

                            var idImageLog = imagesToDelete.FirstOrDefault().id;

                            db.shopImagesTableObj.Remove(imagesToDelete.FirstOrDefault());
                            await db.SaveChangesAsync();
                            _logger.LogInformation($"DeleteItem: {idItemLog}, image {idImageLog} deleted");
                        }
                    }
                }

              
            }
        }

        public List<Item_Get> GetAllItems()
        {

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                List<Item_Get> itemOutput = new List<Item_Get>();

                var itemsTable = db.shopItemsTableObj;



                var itemImagesArr = new List<List<string>>();

                var itemIdArr = new List<int>();

                //Открываем коннект с таблицей айтема
                if (itemsTable != null)
                {
                    foreach (var item in itemsTable)
                    {
                        itemIdArr.Add(item.id);
                    }
                }

                //Открываем коннект внутри функции с таблицей изображений
                foreach (var itemIdP in itemIdArr) {
                    itemImagesArr.Add(GetImagesFromPath(itemIdP, db));
                }


                if (itemsTable != null)
                {
                    var indexes = 0;

                    foreach (var item in itemsTable)
                    {
                        Item_Get itemGet = new Item_Get()
                        {
                            id = item.id,
                            hashName = item.hashName,
                            name = item.name,
                            description = item.description,
                            price = item.price,
                            count = item.count,
                            flags = item.flags,
                            sizes = item.sizes,
                            imagePaths = itemImagesArr[indexes].ToArray()
                        };

                        itemOutput.Add(itemGet);

                        indexes++;
                    }
                }

                return itemOutput;
            }
        }

        private int GetIdItemFromName(string itemName, DataContext _db)
        {
            var items = _db.shopItemsTableObj;

            foreach (var item in items)
            {
                if (item.name == itemName)
                    return item.id;
            }

            return 0;
        }

        public async Task AddImages(string[] imageLinks, string itemName)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var itemIdParsed = GetIdItemFromName(itemName, db);

                for (int i = 0; i < imageLinks.Count(); i++)
                {
                    ShopImagesTable shopImagesTable = new ShopImagesTable()
                    {
                        itemId = itemIdParsed,
                        imageLink = imageLinks[i]
                    };

                    db.shopImagesTableObj.Add(shopImagesTable);
                    await db.SaveChangesAsync();

                    _logger.LogInformation($"AddImages: Image for {itemName}, uploaded; Path: {imageLinks[i]}");
                }
            }
        }

    }
}
