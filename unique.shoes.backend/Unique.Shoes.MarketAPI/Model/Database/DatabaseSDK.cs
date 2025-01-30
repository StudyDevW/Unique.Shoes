using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Immutable;
using System.Security.Cryptography;
using System.Text;
using unique.shoes.middleware.Database.DBO;
using unique.shoes.middleware.Services;
using Unique.Shoes.MarketAPI.Model.Services;
using Unique.Shoes.Middleware.Broker.DTO;
using Unique.Shoes.Middleware.Database.DBO;
using Unique.Shoes.Middleware.Database.DTO;
using Unique.Shoes.Middleware.Database.DTO.ShopCart;
using Unique.Shoes.Middleware.Services;

namespace Unique.Shoes.MarketAPI.Model.Database
{
    public class DatabaseSDK : IDatabaseService
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _conf;
        private readonly ICacheService _cache;
        private readonly IRabbitMQService _rabbit;

        public DatabaseSDK(IConfiguration configuration, ICacheService cache, IRabbitMQService rabbit)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("MarketAPI | database-sdk-logger");
            _conf = configuration;
            _cache = cache;
            _rabbit = rabbit;
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

                _logger.LogInformation($"CreateItem: {shopItemsTable.hashName}, создан");
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
            if (filePath.Contains("migrated_images"))
                return;

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
                    _logger.LogInformation($"DeleteItem: {idItemLog} товар удален");

                    if (imagesToDelete != null) {
                
                        while (imagesToDelete.Count() > 0)
                        {
                            DeleteImageFromPath(imagesToDelete.FirstOrDefault().imageLink);

                            var idImageLog = imagesToDelete.FirstOrDefault().id;

                            db.shopImagesTableObj.Remove(imagesToDelete.FirstOrDefault());
                            await db.SaveChangesAsync();
                            _logger.LogInformation($"DeleteItem: {idItemLog}, изображение id: {idImageLog} удалено");
                        }
                    }
                }

              
            }
        }


        public Item_Get GetItem(int id)
        {

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var item = db.shopItemsTableObj.Where(c => c.id == id).FirstOrDefault();

                if (item != null)
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
                        imagePaths = GetImagesFromPath(item.id, db).ToArray()
                     };

                    return itemGet;
                }

                _logger.LogInformation($"GetItem: товар {id} запрошен успешно");

                return new Item_Get() {  };
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

                _logger.LogInformation($"GetAllItems: товары запрошены успешно");

                return itemOutput;
            }
        }

        private int GetIdItemFromName(string itemName, DataContext _db)
        {
            var itemSelected = _db.shopItemsTableObj.Where(c => c.name == itemName).FirstOrDefault();

            if (itemSelected != null)
            {
                return itemSelected.id;
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

                    _logger.LogInformation($"AddImages: Изображение для товара id: {shopImagesTable.itemId}, загружено; Path: {imageLinks[i]}");
                }
            }
        }

        public bool ExistItemShopCart(string hashName, int userId)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var shopCartObj = db.shopCartTableObj.Where(c => c.userId == userId && c.hashName == hashName).FirstOrDefault();
       
                if (shopCartObj != null)
                {
                    _logger.LogInformation($"ExistItemShopCart: Товар {hashName} существует в корзине для пользователя id: {userId}");
                    return true;
                }
            }

            return false;
        }

        public async Task AddItemShopCart(ShopCart_Add dtoObj)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var shopItem = db.shopItemsTableObj.Where(c => c.hashName == dtoObj.hashName).FirstOrDefault();

                if (shopItem != null)
                {
                    ShopCartTable shopCartTable = new ShopCartTable()
                    {
                        hashName = dtoObj.hashName,
                        userId = dtoObj.userId,
                        countItem = dtoObj.countItem,
                        size = dtoObj.size
                    };

                    _logger.LogInformation($"AddItemShopCart: Товар {dtoObj.hashName} успешно добавлен в корзину для пользователя id: {dtoObj.userId}");

                    db.shopCartTableObj.Add(shopCartTable);
                    await db.SaveChangesAsync();
                }
                else
                {
                    throw new Exception("hashName doesnt exist");
                }

            }
        }

        public ShopCart_GetAll GetShopCartItems(int idUser)
        {
            ShopCart_GetAll shopCartOutput = new ShopCart_GetAll()
            {
                shopCartItem = new List<ShopCart_GetAll_Item>(),
                shopCartInfo = new ShopCart_GetAll_Info()
            };

            List<ShopCart_GetAll_Item> shopCartItems = new List<ShopCart_GetAll_Item>();

            ShopCart_GetAll_Info shopCartInfo = new ShopCart_GetAll_Info();

            int priceFinal = 0;
            int countFinal = 0;

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                //Получаем объекты корзины из бд
                var shopCartItemDbObj = db.shopCartTableObj.Where(c => c.userId == idUser).OrderBy(sort => sort.id).ToList();


                for (int i = 0; i < shopCartItemDbObj.Count(); i++)
                {
                    //Сверяем hashName из корзины и из таблицы товаров чтобы заполнить данные о товаре
                    var shopItemDbObj = db.shopItemsTableObj
                        .Where(c => c.hashName == shopCartItemDbObj[i].hashName)
                        .FirstOrDefault();

                    //_logger.LogInformation(shopCartItemDbObj[i].id.ToString());

                    if (shopItemDbObj != null)
                    {
                        var imageObj = db.shopImagesTableObj.Where(c => c.itemId == shopItemDbObj.id).FirstOrDefault();

                        ShopCart_GetAll_Item shopItem = new ShopCart_GetAll_Item()
                        {
                            id = shopCartItemDbObj[i].id,
                            itemId = shopItemDbObj.id,
                            hashName = shopItemDbObj.hashName,
                            name = shopItemDbObj.name,
                            price = shopItemDbObj.price * shopCartItemDbObj[i].countItem,
                            size = shopCartItemDbObj[i].size,
                            countItem = shopCartItemDbObj[i].countItem,
                            imageLink = imageObj != null ? imageObj.imageLink : null
                        };

                        priceFinal += shopItem.price;
                        countFinal += shopItem.countItem;
                        shopCartItems.Add(shopItem);
                    }

                }



                shopCartInfo = new ShopCart_GetAll_Info()
                {
                    count = countFinal,
                    totalPrice = priceFinal
                };

                shopCartOutput = new ShopCart_GetAll()
                {
                    shopCartItem = shopCartItems,
                    shopCartInfo = shopCartInfo
                };
            }

            return shopCartOutput;
        }

        public async Task ChangeItemShopCart(int cartId, ShopCart_Change dtoObj)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var shopCartObj = db.shopCartTableObj.Where(c => c.id == cartId).FirstOrDefault();

                if (shopCartObj != null)
                {
                    if (shopCartObj.countItem != dtoObj.countItem)
                    {
                        shopCartObj.countItem = dtoObj.countItem;
                    }

                    _logger.LogInformation($"ChangeItemShopCart: cartId: {cartId} успешно изменил количество на count: {dtoObj.countItem}");


                    await db.SaveChangesAsync();
                }
            }
        }

        public async Task DeleteItemShopCart(int cartId)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var shopCartObj = db.shopCartTableObj.Where(c => c.id == cartId).FirstOrDefault();

                if (shopCartObj != null)
                {
                    db.shopCartTableObj.Remove(shopCartObj);
                    await db.SaveChangesAsync();

                    _logger.LogInformation($"DeleteItemShopCart: cartId: {cartId}, запись успешно удалена!");

                }
            }
        }

        private string GenerateOrderKey()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            const int length = 10;

            Random random = new Random();

            string key_ret = new string(Enumerable.Repeat(chars, length)
                                .Select(s => s[random.Next(s.Length)]).ToArray());

            //while (SimilarKeyMedia(key_ret))
            //{
            //    key_ret = new string(Enumerable.Repeat(chars, length)
            //                    .Select(s => s[random.Next(s.Length)]).ToArray());
            //}

            return "ORDERKEY-" + key_ret;
        }

        public async Task<string> AddOrderUser(Pay_Order dtoObj)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var key_order = GenerateOrderKey();

                var hashPayGenerated = GenerateMD5Hash("id: " + key_order + " user pay code");

                OrderTable orderTable = new OrderTable()
                {
                    hashPay = hashPayGenerated,
                    userId = dtoObj.userId,
                    deliveryAddress = dtoObj.deliveryAddress,
                    deliveryStatus = "wait_pay",
                    status = "waiting",
                    price = dtoObj.price,
                    creationDate = DateTime.UtcNow
                };

                db.shopOrderTableObj.Add(orderTable);
                await db.SaveChangesAsync();

                for (int i = 0; i < dtoObj.items.Count(); i++)
                {   
                    OrderItemsTable orderItemsTable = new OrderItemsTable()
                    {
                        hashName = dtoObj.items[i].hashName,
                        hashPay = hashPayGenerated,
                        size = dtoObj.items[i].size,
                        count = dtoObj.items[i].count
                    };

                    db.shopOrderItemsTableObj.Add(orderItemsTable);
                    await db.SaveChangesAsync();
                }

                _logger.LogInformation($"Заказ {hashPayGenerated} создан\nИнформация о товарах загружена в заказ");
              

                _rabbit.SendMessage<MarketToPaymentMQ>(
                    new MarketToPaymentMQ() 
                    { 
                        hashPay = hashPayGenerated,
                        price = dtoObj.price
                    }, "payment_queue_request");

                _logger.LogInformation($"Заказ {hashPayGenerated} был отправлен в очередь payment_queue_request");

                return hashPayGenerated;
            }
        }

        public List<string> GetAllPaymentHashes(int userId)
        {
            List<string> hashes = new List<string>();   

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var orderObj = db.shopOrderTableObj.Where(c => c.userId == userId).ToList();

                if (orderObj != null)
                {
                    for (int i = 0; i < orderObj.Count(); i++)
                    {
                        hashes.Add(orderObj[i].hashPay);
                    }
                }
            }

            return hashes;
        }

        public async Task OrderFinal(string hashPay)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var orderObj = db.shopOrderTableObj.Where(c => c.hashPay == hashPay).FirstOrDefault();

                if (orderObj != null)
                {
                    orderObj.status = "payed";
                    orderObj.deliveryStatus = "packing_and_sorting";
                    await db.SaveChangesAsync();
                }
            }
        }

        public Order_All OrderAll(int userId)
        {
            Order_All orderAll = new Order_All()
            {
                orders = new List<Order_Info>()
            };

            List<Order_Info> ordersFill = new List<Order_Info>();

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var ordersFind = db.shopOrderTableObj.Where(c => c.userId == userId).ToList();

                if (ordersFind != null)
                {
                    for (int i = 0; i < ordersFind.Count(); i++)
                    {
                        var ordersItemsFind = db.shopOrderItemsTableObj.Where(c => c.hashPay == ordersFind[i].hashPay).ToList();

                        List<Order_Item> items = new List<Order_Item>();

                        //Заполнение купленных товаров в заказе
                        for (int j = 0; j < ordersItemsFind.Count(); j++)
                        {
                            var itemShop = db.shopItemsTableObj.Where(c => c.hashName == ordersItemsFind[j].hashName).FirstOrDefault();

                            if (itemShop != null)
                            {
                                var imageObj = db.shopImagesTableObj.Where(c => c.itemId == itemShop.id).FirstOrDefault();

                                Order_Item orderItem = new Order_Item()
                                {
                                    itemId = itemShop.id,
                                    hashName = itemShop.hashName,
                                    name = itemShop.name,
                                    size = ordersItemsFind[j].size,
                                    countItem = ordersItemsFind[j].count,
                                    price = itemShop.price * ordersItemsFind[j].count,
                                    imageLink = imageObj != null ? imageObj.imageLink : null
                                };

                                items.Add(orderItem);
                            }
                        }

                        //Вывод информации о заказе вместе с купленными товарами
                        Order_Info orderInfo = new Order_Info() {
                            hashPay = ordersFind[i].hashPay,
                            payStatus = ordersFind[i].status,
                            deliveryStatus = ordersFind[i].deliveryStatus,
                            deliveryAddress = ordersFind[i].deliveryAddress,
                            price = ordersFind[i].price,
                            items = items,
                            creationDate = ordersFind[i].creationDate
                        };

                        ordersFill.Add(orderInfo);
                    }

                    orderAll.orders = ordersFill;
                }

                return orderAll;
            }

        }

    }
}
