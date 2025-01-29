using Microsoft.EntityFrameworkCore;
using unique.shoes.middleware.Database.DBO;
using Unique.Shoes.Middleware.Database.DBO;

namespace Unique.Shoes.MarketAPI.Model.Database
{
    public class DataContext : DbContext
    {
        private readonly string _connectionString;

        public DataContext(string connectionString)
        {
            _connectionString = connectionString;
            Database.EnsureCreated();
        }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<ShopItemsTable> shopItemsTableObj { get; set; }

        public DbSet<ShopImagesTable> shopImagesTableObj { get; set; }

        public DbSet<ShopCartTable> shopCartTableObj { get; set; }

        public DbSet<OrderTable> shopOrderTableObj { get; set; }

        public DbSet<OrderItemsTable> shopOrderItemsTableObj { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql(_connectionString);
            }

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ShopImagesTable>().HasData(
                new ShopImagesTable()
                {
                    id = 1, 
                    itemId = 1,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W).png"
                },
                new ShopImagesTable()
                {
                    id = 2,
                    itemId = 1,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (second).png"
                },
                new ShopImagesTable()
                {
                    id = 3,
                    itemId = 1,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (third).png"
                },
                new ShopImagesTable()
                {
                    id = 4,
                    itemId = 1,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (four).png"
                },
                new ShopImagesTable()
                {
                    id = 5,
                    itemId = 1,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (five).png"
                },
                new ShopImagesTable()
                {
                    id = 6,
                    itemId = 2,
                    imageLink = "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra.png"
                },
                new ShopImagesTable()
                {
                    id = 7,
                    itemId = 2,
                    imageLink = "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 8,
                    itemId = 2,
                    imageLink = "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra(third).jpg"
                },
                new ShopImagesTable()
                {
                    id = 9,
                    itemId = 2,
                    imageLink = "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra(four).jpg"
                },
                new ShopImagesTable()
                {
                    id = 10,
                    itemId = 3,
                    imageLink = "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red.png"
                },
                new ShopImagesTable()
                {
                    id = 11,
                    itemId = 3,
                    imageLink = "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 12,
                    itemId = 3,
                    imageLink = "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red(third).jpg"
                },
                new ShopImagesTable()
                {
                    id = 13,
                    itemId = 3,
                    imageLink = "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red(four).jpg"
                },
                new ShopImagesTable()
                {
                    id = 14,
                    itemId = 4,
                    imageLink = "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate.png"
                },
                new ShopImagesTable()
                {
                    id = 15,
                    itemId = 4,
                    imageLink = "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate (second).png"
                },
                new ShopImagesTable()
                {
                    id = 16,
                    itemId = 4,
                    imageLink = "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate (third).png"
                },
                new ShopImagesTable()
                {
                    id = 17,
                    itemId = 4,
                    imageLink = "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate (four).png"
                },
                new ShopImagesTable()
                {
                    id = 18,
                    itemId = 5,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo transparent.png"
                },
                new ShopImagesTable()
                {
                    id = 19,
                    itemId = 5,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo(second).png"
                },
                new ShopImagesTable()
                {
                    id = 20,
                    itemId = 5,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo(third).png"
                },
                new ShopImagesTable()
                {
                    id = 21,
                    itemId = 6,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom.png"
                },
                new ShopImagesTable()
                {
                    id = 22,
                    itemId = 6,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom(second).png"
                },
                new ShopImagesTable()
                {
                    id = 23,
                    itemId = 6,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom(third).png"
                },
                new ShopImagesTable()
                {
                    id = 24,
                    itemId = 6,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom(four).png"
                },
                new ShopImagesTable()
                {
                    id = 25,
                    itemId = 7,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott.png"
                },
                new ShopImagesTable()
                {
                    id = 26,
                    itemId = 7,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 27,
                    itemId = 7,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott(third).jpg"
                },
                new ShopImagesTable()
                {
                    id = 28,
                    itemId = 7,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott(four).jpg"
                },
                new ShopImagesTable()
                {
                    id = 29,
                    itemId = 8,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (main).png"
                },
                new ShopImagesTable()
                {
                    id = 30,
                    itemId = 8,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (second).png"
                },
                new ShopImagesTable()
                {
                    id = 31,
                    itemId = 8,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (third).png"
                },
                new ShopImagesTable()
                {
                    id = 32,
                    itemId = 8,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (four).png"
                },
                new ShopImagesTable()
                {
                    id = 33,
                    itemId = 9,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior.png"
                },
                new ShopImagesTable()
                {
                    id = 34,
                    itemId = 9,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 35,
                    itemId = 9,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior(third).jpg"
                },
                new ShopImagesTable()
                {
                    id = 36,
                    itemId = 9,
                    imageLink = "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior(four).jpg"
                },
                new ShopImagesTable()
                {
                    id = 37,
                    itemId = 10,
                    imageLink = "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co..png"
                },
                new ShopImagesTable()
                {
                    id = 38,
                    itemId = 10,
                    imageLink = "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(second).png"
                },
                new ShopImagesTable()
                {
                    id = 39,
                    itemId = 10,
                    imageLink = "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(third).png"
                },
                new ShopImagesTable()
                {
                    id = 40,
                    itemId = 10,
                    imageLink = "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(four).png"
                },
                new ShopImagesTable()
                {
                    id = 41,
                    itemId = 10,
                    imageLink = "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(five).png"
                },
                new ShopImagesTable()
                {
                    id = 42,
                    itemId = 11,
                    imageLink = "/app/migrated_images/The North Face Glenclyffe Low Vibram TNF Black/The North Face Glenclyffe Low Vibram TNF Black.jpg.png"
                },
                new ShopImagesTable()
                {
                    id = 43,
                    itemId = 11,
                    imageLink = "/app/migrated_images/The North Face Glenclyffe Low Vibram TNF Black/The North Face Glenclyffe Low Vibram TNF Black(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 44,
                    itemId = 11,
                    imageLink = "/app/migrated_images/The North Face Glenclyffe Low Vibram TNF Black/The North Face Glenclyffe Low Vibram TNF Black(third).jpg"
                },
                new ShopImagesTable()
                {
                    id = 45,
                    itemId = 12,
                    imageLink = "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac.png"
                },
                new ShopImagesTable()
                {
                    id = 46,
                    itemId = 12,
                    imageLink = "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac(second).png"
                },
                new ShopImagesTable()
                {
                    id = 47,
                    itemId = 12,
                    imageLink = "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac(third).png"
                },
                new ShopImagesTable()
                {
                    id = 48,
                    itemId = 12,
                    imageLink = "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac(four).png"
                },
                new ShopImagesTable()
                {
                    id = 49,
                    itemId = 13,
                    imageLink = "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black.png"
                },
                new ShopImagesTable()
                {
                    id = 50,
                    itemId = 13,
                    imageLink = "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(second).png"
                },
                new ShopImagesTable()
                {
                    id = 51,
                    itemId = 13,
                    imageLink = "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(third).png"
                },
                new ShopImagesTable()
                {
                    id = 52,
                    itemId = 13,
                    imageLink = "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(four).png"
                },
                new ShopImagesTable()
                {
                    id = 53,
                    itemId = 13,
                    imageLink = "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(five).jpg"
                },
                new ShopImagesTable()
                {
                    id = 54,
                    itemId = 14,
                    imageLink = "/app/migrated_images/Timberland 3-Eye Lug Handsewn Boat Shoe Brown/Timberland 3-Eye Lug Handsewn Boat Shoe Brown.jpg.png"
                },
                new ShopImagesTable()
                {
                    id = 55,
                    itemId = 14,
                    imageLink = "/app/migrated_images/Timberland 3-Eye Lug Handsewn Boat Shoe Brown/Timberland 3-Eye Lug Handsewn Boat Shoe Brown(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 56,
                    itemId = 15,
                    imageLink = "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch.png"
                },
                new ShopImagesTable()
                {
                    id = 57,
                    itemId = 15,
                    imageLink = "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 58,
                    itemId = 15,
                    imageLink = "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch(third).jpg"
                },
                new ShopImagesTable()
                {
                    id = 59,
                    itemId = 15,
                    imageLink = "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch(four).jpg"
                },
                new ShopImagesTable()
                {
                    id = 60,
                    itemId = 16,
                    imageLink = "/app/migrated_images/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat.png"
                },
                new ShopImagesTable()
                {
                    id = 61,
                    itemId = 16,
                    imageLink = "/app/migrated_images/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat(second).jpg"
                },
                new ShopImagesTable()
                {
                    id = 62,
                    itemId = 16,
                    imageLink = "/app/migrated_images/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat(third).jpg"
                },
                new ShopImagesTable()
                {
                    id = 63,
                    itemId = 17,
                    imageLink = "/app/migrated_images/UGG Classic Ultra Mini Boot Black (W)/UGG Classic Ultra Mini Boot Black (W).png"
                },
                new ShopImagesTable()
                {
                    id = 64,
                    itemId = 18,
                    imageLink = "/app/migrated_images/UGG Classic Ultra Mini Boot Chestnut (W)/UGG Classic Ultra Mini Boot Chestnut (W).png"
                }
            );

            modelBuilder.Entity<ShopItemsTable>().HasData(
                new ShopItemsTable() 
                { 
                  id = 1, 
                  hashName = "e694bbbcd87f95e8a052f7369ac49304",
                  name = "Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)",
                  description = "Nike Air Jordan 1 Retro Low OG SP " +
                  "Travis Scott Olive (W) — это уникальная версия классической модели кроссовок Air Jordan 1, " +
                  "созданная в сотрудничестве с популярным рэпером Трэвисом Скоттом.",
                  flags = new string[] { "new", "skate" },
                  count = true,
                  price = 79990,
                  sizes = new string[] { "36 RU", "41 RU" }
                },
                new ShopItemsTable()
                {
                    id = 2,
                    hashName = "1dd40325fdbf8b65d87f4b85c873dac3",
                    name = "Yeezy 350 Zebra",
                    description = "Yeezy 350 Zebra — легендарная модель Yeezy Boost 350 от Канье Уэста " +
                    "в новой расцветке. Основа кроссовок изготовлена по инновационной технологии Primeknit" +
                    " в черно-белой палитре. Белая полоса сбоку с красной надписью «SPLY-350», шнурки в тон пары. " +
                    "Подошва с использованием амортизирующей технологии Boost завершает дизайн. Релиз состоялся в " +
                    "феврале 2017 года.",
                    flags = new string[] { "new", "sneakers" },
                    count = true,
                    price = 47490,
                    sizes = new string[] { "36 RU", "37 RU", "38 RU", "39 RU", "41 RU" }
                },
                new ShopItemsTable()
                {
                    id = 3,
                    hashName = "dd0f37389cea07c32aac4153041575c8",
                    name = "Yeezy 350 Black Red",
                    description = "Yeezy 350 Black Red — легендарная модель Yeezy Boost 350 от Канье Уэста в новой расцветке. " +
                    "Основа кроссовок изготовлена по инновационной технологии Primeknit в черном цвете. " +
                    "Сбоку ярко-красная надпись «SPLY-350», выполненная в обратном порядке. Подошва с использованием амортизирующей " +
                    "технологии Boost завершает дизайн. Релиз состоялся в ноябре 2016 года.",
                    flags = new string[] { "new", "sneakers" },
                    count = true,
                    price = 52490,
                    sizes = new string[] { "36 RU", "37 RU", "38 RU", "39 RU", "41 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 4,
                    hashName = "e86692549ee9833b9775079255e5c007",
                    name = "Yeezy 350 Slate",
                    description = "Представляем вам кроссовки Yeezy 350 Slate — идеальное сочетание стиля и комфорта, " +
                    "созданное для настоящих ценителей моды. Эта модель выделяется своей уникальной расцветкой Slate, " +
                    "которая легко впишется в любой гардероб. Изготовленные из премиальных материалов, Yeezy 350 обеспечивают " +
                    "непревзойденную легкость и удобство на каждом шагу. Инновационная технология подошвы гарантирует " +
                    "идеальную амортизацию и поддержку стопы. Позвольте себе быть в центре внимания и подчеркнуть свой " +
                    "образ с Yeezy 350 Slate — выбором, который говорит сам за себя.",
                    flags = new string[] { "new", "sneakers" },
                    count = true,
                    price = 57690,
                    sizes = new string[] { "36 RU", "37 RU", "39 RU", "41 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 5,
                    hashName = "540d45d05a10887fce463570602c95c7",
                    name = "Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo",
                    description = "Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo - модель кроссовок," +
                    " вдохновленная энергией и харизмой Зайона Уильямсона, сочетает в себе оригинальный дизайн и передовые технологии, " +
                    "что делает их идеальным выбором для настоящих ценителей. Уникальная цветовая палитра и детали," +
                    " отражающие личность Зайона, делают эти кроссовки настоящим произведением искусства, которое выделит вас из толпы. " +
                    "Высококачественные материалы и продуманная конструкция обеспечивают отличную поддержку и комфорт при каждом движении," +
                    " позволяя вам чувствовать себя уверенно в любой ситуации. Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo " +
                    "идеально подходят как для активного отдыха, так и для повседневной носки, добавляя вашему образу нотку спортивной элегантности.",
                    flags = new string[] { "demand", "skate" },
                    count = true,
                    price = 134990,
                    sizes = new string[] { "36 RU", "37 RU", "39 RU", "41 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 6,
                    hashName = "959da7edcf47d920db135e258d4b5749",
                    name = "Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom",
                    description = "Black Phantom выполнены в основном черном цвете," +
                    " который придает им стильный и загадочный вид. Однако черный верх из кожаных " +
                    "и замшевых материалов дополнен контрастными акцентами, включая яркие детали," +
                    " которые делают модель более заметной. Существует также элегантный логотип \"Cactus Jack\" на петле язычка. " +
                    "Верх кроссовок изготовлен из высококачественной кожи и замши, что обеспечивает долговечность и комфорт. " +
                    "Использование различных текстур материалов добавляет интересный визуальный эффект и делает обувь более привлекательной.",
                    flags = new string[] { "demand", "skate" },
                    count = true,
                    price = 94990,
                    sizes = new string[] { "36 RU", "37 RU", "38 RU", "40 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 7,
                    hashName = "a18efc63596ec33ccd28943c64e821e3",
                    name = "Nike Air Jordan 1 Low Fragment x Travis Scott",
                    description = "Jordan 1 Low fragment design x Travis Scott – это новая пара в коллаборации японского дизайнера " +
                    "Хироши Фудживара и рэпера Трэвиса Скотта. Основа кроссовок из высококачественной белой кожи, на ее фоне выделяются черные детали, " +
                    "расположенные на носке и около шнурков. Главной особенностью дизайнов с участием Трэвиса Скотта является Swoosh в зеркальной " +
                    "ориентации, в данной модели в бежевом оттенке, как и шнурки и подошва. Акцентные элементы из синей кожи в области пятки. " +
                    "Релиз состоялся в августе 2021.",
                    flags = new string[] { "demand", "skate" },
                    count = true,
                    price = 241900,
                    sizes = new string[] { "36 RU", "37 RU", "38 RU", "40 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 8,
                    hashName = "1e1d8f10e78ca8ca0d9835f1cdc6effb",
                    name = "Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha",
                    description = "Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha - уникальную модель, " +
                    "которая сочетает в себе элементы уличной культуры и высококачественный дизайн. " +
                    "Эти кроссовки идеально подойдут как для повседневной носки, так и для создания стильных образов." +
                    "Уникальная цветовая схема в оттенках коричневого и бежевого, дополненная характерными деталями от Travis Scott, " +
                    "делает эту модель настоящим произведением искусства, которое привлечет внимание.Высококачественные материалы и " +
                    "продуманная конструкция обеспечивают отличную поддержку и комфорт, позволяя вам уверенно двигаться в любой ситуации. " +
                    "Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha идеально подходят для создания как спортивных, " +
                    "так и кэжуал-образов, добавляя вашему стилю нотку эксклюзивности.",
                    flags = new string[] { "demand", "skate" },
                    count = true,
                    price = 251890,
                    sizes = new string[] { "36 RU", "37 RU", "38 RU", "40 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 9,
                    hashName = "afbcdd8defd959d8bd12188d9bea0a32",
                    name = "Nike Air Jordan 1 Low Dior",
                    description = "Nike Air Jordan 1 Low Dior - уникальную модель кроссовок, " +
                    "которая сочетает в себе элегантный дизайн и высокие технологии. " +
                    "Эти кроссовки станут идеальным дополнением вашего образа благодаря " +
                    "утонченному внешнему виду и качественным материалам.Выпущенные в ограниченном количестве, " +
                    "они выделяются из толпы благодаря эксклюзивным элементам, вдохновленным модой Dior." +
                    "Премиальная кожа и подошва из ЭВА обеспечивают идеальную поддержку и мягкость при каждом шаге " +
                    "Nike Air Jordan 1 Low Dior идеально подходят как для повседневной носки, так и для особых случаев, " +
                    "придавая вашему наряду нотку роскоши",
                    flags = new string[] { "skate" },
                    count = true,
                    price = 2345490,
                    sizes = new string[] { "40 RU", "42 RU" }
                },
                new ShopItemsTable()
                {
                    id = 10,
                    hashName = "56d1ef88ef8ba2ab91b2339e9cfb6f69",
                    name = "Nike Air Force 1 Low SP Tiffany And Co.",
                    description = "Nike Air Force 1 Low SP \"Tiffany & Co.\" — это специальная версия культовых кроссовок " +
                    "Air Force 1, созданная в сотрудничестве с известным ювелирным домом Tiffany & Co. Эта модель стала " +
                    "знаковой благодаря своим уникальным дизайнерским элементам и ограниченному выпуску, что сделало её " +
                    "одним из самых желанных предметов для коллекционеров и поклонников бренда. Nike Air Force 1 Low SP " +
                    "\"Tiffany & Co. — это не только стильное дополнение для гардероба, но и предмет коллекционирования, " +
                    "который олицетворяет как уличную культуру, так и элегантность, присущую ювелирному дому Tiffany. " +
                    "Эта модель быстро стала желанным объектом среди поклонников кроссовок и коллекционеров, благодаря " +
                    "своему эксклюзивному статусу и уникальному дизайну.",
                    flags = new string[] { "skate" },
                    count = true,
                    price = 249990,
                    sizes = new string[] { "40 RU", "42 RU" }
                },
                new ShopItemsTable()
                {
                    id = 11,
                    hashName = "2effa9b53364d727786c20e1b601389a",
                    name = "The North Face Glenclyffe Low Vibram TNF Black",
                    description = "The North Face Glenclyffe Low Vibram в цвете TNF Black — " +
                    "это стильная и функциональная обувь, предназначенная для активного отдыха и " +
                    "повседневного использования. Вот несколько ключевых характеристик и особенностей " +
                    "этой модели: Комфорт и поддержка, Подошва Vibram, Качественные материалы",
                    flags = new string[] { "sneakers" },
                    count = true,
                    price = 32990,
                    sizes = new string[] { "38 RU", "39 RU", "40 RU", "41 RU" }
                },
                new ShopItemsTable()
                {
                    id = 12,
                    hashName = "6e58c6390add21e2dc89c0427bada0aa",
                    name = "Yeezy 500 High Sumac",
                    description = "Yeezy 500 High Sumac — легендарная модель " +
                    "Yeezy Boost 500 от Канье Уэста в новой расцветке. Основа " +
                    "кроссовок выполнена из сетчатого материала с вставками из кожи и " +
                    "замши различных оттенков коричневого и песочного. Акцентные " +
                    "ярко-красные шнурки, массивная подошва с технологией амортизации " +
                    "adiprene. Релиз состоялся в мае 2021 года.",
                    flags = new string[] { "sneakers" },
                    count = true,
                    price = 76990,
                    sizes = new string[] { "38 RU", "39 RU", "40 RU", "41 RU" }
                },
                new ShopItemsTable()
                {
                    id = 13,
                    hashName = "1585251a1776b6460b8d7c84fff951bd",
                    name = "Nike Lunar Force 1 High Duckboot Ale Brown Black",
                    description = "Nike Lunar Force 1 High Duckboot Ale Brown Black - " +
                    "это мужская модель, изначально разработанная для игры в баскетбол. " +
                    "Модель Nike Lunar Force 1 High Duckboot в цветовом исполнении Ale Brown " +
                    "Black оснащена амортизирующей системой Air, обеспечивающей легкость и комфорт. " +
                    "От сырости и холода защищает высокий воротник, охватывающий щиколотку. " +
                    "Кроссовки имеют шнуровку, застежку-молнию и регулируемую ширину для плотной посадки. " +
                    "Верх выполнен из водостойкой кожи в области пятки и боковых накладок. " +
                    "На носке использована студированная синтетика. Эта модель сочетает в себе функциональность и стиль. " +
                    "Она одинаково подойдет как для активного отдыха, так и повседневной носки. " +
                    "Ее отличает универсальность и практичность в любую погоду.",
                    flags = new string[] { "sneakers" },
                    count = true,
                    price = 30790,
                    sizes = new string[] { "38 RU", "39 RU", "40 RU", "41 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 14,
                    hashName = "8083e87534bb6aa143ad597a2212cb82",
                    name = "Timberland 3-Eye Lug Handsewn Boat Shoe Brown",
                    description = "",
                    flags = new string[] { "uggy" },
                    count = true,
                    price = 32490,
                    sizes = new string[] { "39 RU", "40 RU", "42 RU" }
                },
                new ShopItemsTable()
                {
                    id = 15,
                    hashName = "8070986a95e30ad15788e143eb5e7d56",
                    name = "Timberland Heritage LNY 6 Inch",
                    description = "",
                    flags = new string[] { "uggy" },
                    count = true,
                    price = 19390,
                    sizes = new string[] { "39 RU", "40 RU", "42 RU" }
                },
                new ShopItemsTable()
                {
                    id = 16,
                    hashName = "912a187e12b2f3787e1cbe64e0f9decd",
                    name = "Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat",
                    description = "",
                    flags = new string[] { "uggy" },
                    count = true,
                    price = 90590,
                    sizes = new string[] { "39 RU", "40 RU", "43 RU" }
                },
                new ShopItemsTable()
                {
                    id = 17,
                    hashName = "1606f337e648c9a745562ea470c30be3",
                    name = "UGG Classic Ultra Mini Boot Black (W)",
                    description = "",
                    flags = new string[] { "uggy" },
                    count = true,
                    price = 20190,
                    sizes = new string[] { "36 RU", "37 RU", "38 RU", "39 RU", "40 RU" }
                },
                new ShopItemsTable()
                {
                    id = 18,
                    hashName = "46317750139f5a30ed13626a9a22fec9",
                    name = "UGG Classic Ultra Mini Boot Chestnut (W)",
                    description = "",
                    flags = new string[] { "uggy" },
                    count = true,
                    price = 20790,
                    sizes = new string[] { "36 RU", "37 RU", "38 RU", "39 RU", "40 RU" }
                }


            );



            //modelBuilder.Entity<UsersTable>().HasData(
            //    new UsersTable() { id = 1, firstName = "Администратор", username = "admin", password = "admin", roles = new[] { "Admin" } },
            //    new UsersTable() { id = 2, firstName = "Менеджер", username = "manager", password = "manager", roles = new[] { "Manager" } },
            //    new UsersTable() { id = 3, firstName = "Пользователь", username = "user", password = "user", roles = new[] { "User" } }
            //);



            base.OnModelCreating(modelBuilder);
        }
    }
}
