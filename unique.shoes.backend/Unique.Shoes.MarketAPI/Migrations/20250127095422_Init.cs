using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Unique.Shoes.MarketAPI.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "shopCartTableObj",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userId = table.Column<int>(type: "integer", nullable: false),
                    hashName = table.Column<string>(type: "text", nullable: false),
                    countItem = table.Column<int>(type: "integer", nullable: false),
                    size = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shopCartTableObj", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "shopImagesTableObj",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    itemId = table.Column<int>(type: "integer", nullable: false),
                    imageLink = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shopImagesTableObj", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "shopItemsTableObj",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    hashName = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    flags = table.Column<string[]>(type: "text[]", nullable: true),
                    price = table.Column<int>(type: "integer", nullable: false),
                    count = table.Column<bool>(type: "boolean", nullable: false),
                    sizes = table.Column<string[]>(type: "text[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shopItemsTableObj", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "shopOrderItemsTableObj",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    hashPay = table.Column<string>(type: "text", nullable: false),
                    hashName = table.Column<string>(type: "text", nullable: false),
                    size = table.Column<string>(type: "text", nullable: false),
                    count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shopOrderItemsTableObj", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "shopOrderTableObj",
                columns: table => new
                {
                    hashPay = table.Column<string>(type: "text", nullable: false),
                    userId = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<int>(type: "integer", nullable: false),
                    deliveryStatus = table.Column<string>(type: "text", nullable: false),
                    deliveryAddress = table.Column<string>(type: "text", nullable: false),
                    creationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shopOrderTableObj", x => x.hashPay);
                });

            migrationBuilder.InsertData(
                table: "shopImagesTableObj",
                columns: new[] { "id", "imageLink", "itemId" },
                values: new object[,]
                {
                    { 1, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W).png", 1 },
                    { 2, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (second).png", 1 },
                    { 3, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (third).png", 1 },
                    { 4, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (four).png", 1 },
                    { 5, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)/Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) (five).png", 1 },
                    { 6, "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra.png", 2 },
                    { 7, "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra(second).jpg", 2 },
                    { 8, "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra(third).jpg", 2 },
                    { 9, "/app/migrated_images/Yeezy 350 Zebra/Yeezy 350 Zebra(four).jpg", 2 },
                    { 10, "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red.png", 3 },
                    { 11, "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red(second).jpg", 3 },
                    { 12, "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red(third).jpg", 3 },
                    { 13, "/app/migrated_images/Yeezy 350 Black Red/Yeezy 350 Black Red(four).jpg", 3 },
                    { 14, "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate.png", 4 },
                    { 15, "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate (second).png", 4 },
                    { 16, "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate (third).png", 4 },
                    { 17, "/app/migrated_images/Yeezy 350 Slate/Yeezy 350 Slate (four).png", 4 },
                    { 18, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo transparent.png", 5 },
                    { 19, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo(second).png", 5 },
                    { 20, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo/Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo(third).png", 5 },
                    { 21, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom.png", 6 },
                    { 22, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom(second).png", 6 },
                    { 23, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom(third).png", 6 },
                    { 24, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom/Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom(four).png", 6 },
                    { 25, "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott.png", 7 },
                    { 26, "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott(second).jpg", 7 },
                    { 27, "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott(third).jpg", 7 },
                    { 28, "/app/migrated_images/Nike Air Jordan 1 Low Fragment x Travis Scott/Nike Air Jordan 1 Low Fragment x Travis Scott(four).jpg", 7 },
                    { 29, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (main).png", 8 },
                    { 30, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (second).png", 8 },
                    { 31, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (third).png", 8 },
                    { 32, "/app/migrated_images/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha/Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha (four).png", 8 },
                    { 33, "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior.png", 9 },
                    { 34, "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior(second).jpg", 9 },
                    { 35, "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior(third).jpg", 9 },
                    { 36, "/app/migrated_images/Nike Air Jordan 1 Low Dior/Nike Air Jordan 1 Low Dior(four).jpg", 9 },
                    { 37, "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co..png", 10 },
                    { 38, "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(second).png", 10 },
                    { 39, "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(third).png", 10 },
                    { 40, "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(four).png", 10 },
                    { 41, "/app/migrated_images/Nike Air Force 1 Low SP Tiffany And Co/Nike Air Force 1 Low SP Tiffany And Co.(five).png", 10 },
                    { 42, "/app/migrated_images/The North Face Glenclyffe Low Vibram TNF Black/The North Face Glenclyffe Low Vibram TNF Black.jpg.png", 11 },
                    { 43, "/app/migrated_images/The North Face Glenclyffe Low Vibram TNF Black/The North Face Glenclyffe Low Vibram TNF Black(second).jpg", 11 },
                    { 44, "/app/migrated_images/The North Face Glenclyffe Low Vibram TNF Black/The North Face Glenclyffe Low Vibram TNF Black(third).jpg", 11 },
                    { 45, "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac.png", 12 },
                    { 46, "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac(second).png", 12 },
                    { 47, "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac(third).png", 12 },
                    { 48, "/app/migrated_images/Yeezy 500 High Sumac/Yeezy 500 High Sumac(four).png", 12 },
                    { 49, "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black.png", 13 },
                    { 50, "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(second).png", 13 },
                    { 51, "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(third).png", 13 },
                    { 52, "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(four).png", 13 },
                    { 53, "/app/migrated_images/Nike Lunar Force 1 High Duckboot Ale Brown Black/Nike Lunar Force 1 High Duckboot Ale Brown Black(five).jpg", 13 },
                    { 54, "/app/migrated_images/Timberland 3-Eye Lug Handsewn Boat Shoe Brown/Timberland 3-Eye Lug Handsewn Boat Shoe Brown.jpg.png", 14 },
                    { 55, "/app/migrated_images/Timberland 3-Eye Lug Handsewn Boat Shoe Brown/Timberland 3-Eye Lug Handsewn Boat Shoe Brown(second).jpg", 14 },
                    { 56, "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch.png", 15 },
                    { 57, "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch(second).jpg", 15 },
                    { 58, "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch(third).jpg", 15 },
                    { 59, "/app/migrated_images/Timberland Heritage LNY 6 Inch/Timberland Heritage LNY 6 Inch(four).jpg", 15 },
                    { 60, "/app/migrated_images/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat.png", 16 },
                    { 61, "/app/migrated_images/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat(second).jpg", 16 },
                    { 62, "/app/migrated_images/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat/Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat(third).jpg", 16 },
                    { 63, "/app/migrated_images/UGG Classic Ultra Mini Boot Black (W)/UGG Classic Ultra Mini Boot Black (W).png", 17 },
                    { 64, "/app/migrated_images/UGG Classic Ultra Mini Boot Chestnut (W)/UGG Classic Ultra Mini Boot Chestnut (W).png", 18 }
                });

            migrationBuilder.InsertData(
                table: "shopItemsTableObj",
                columns: new[] { "id", "count", "description", "flags", "hashName", "name", "price", "sizes" },
                values: new object[,]
                {
                    { 1, true, "Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) — это уникальная версия классической модели кроссовок Air Jordan 1, созданная в сотрудничестве с популярным рэпером Трэвисом Скоттом.", new[] { "new", "skate" }, "e694bbbcd87f95e8a052f7369ac49304", "Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)", 79990, new[] { "36 RU", "41 RU" } },
                    { 2, true, "Yeezy 350 Zebra — легендарная модель Yeezy Boost 350 от Канье Уэста в новой расцветке. Основа кроссовок изготовлена по инновационной технологии Primeknit в черно-белой палитре. Белая полоса сбоку с красной надписью «SPLY-350», шнурки в тон пары. Подошва с использованием амортизирующей технологии Boost завершает дизайн. Релиз состоялся в феврале 2017 года.", new[] { "new", "sneakers" }, "1dd40325fdbf8b65d87f4b85c873dac3", "Yeezy 350 Zebra", 47490, new[] { "36 RU", "37 RU", "38 RU", "39 RU", "41 RU" } },
                    { 3, true, "Yeezy 350 Black Red — легендарная модель Yeezy Boost 350 от Канье Уэста в новой расцветке. Основа кроссовок изготовлена по инновационной технологии Primeknit в черном цвете. Сбоку ярко-красная надпись «SPLY-350», выполненная в обратном порядке. Подошва с использованием амортизирующей технологии Boost завершает дизайн. Релиз состоялся в ноябре 2016 года.", new[] { "new", "sneakers" }, "dd0f37389cea07c32aac4153041575c8", "Yeezy 350 Black Red", 52490, new[] { "36 RU", "37 RU", "38 RU", "39 RU", "41 RU", "43 RU" } },
                    { 4, true, "Представляем вам кроссовки Yeezy 350 Slate — идеальное сочетание стиля и комфорта, созданное для настоящих ценителей моды. Эта модель выделяется своей уникальной расцветкой Slate, которая легко впишется в любой гардероб. Изготовленные из премиальных материалов, Yeezy 350 обеспечивают непревзойденную легкость и удобство на каждом шагу. Инновационная технология подошвы гарантирует идеальную амортизацию и поддержку стопы. Позвольте себе быть в центре внимания и подчеркнуть свой образ с Yeezy 350 Slate — выбором, который говорит сам за себя.", new[] { "new", "sneakers" }, "e86692549ee9833b9775079255e5c007", "Yeezy 350 Slate", 57690, new[] { "36 RU", "37 RU", "39 RU", "41 RU", "43 RU" } },
                    { 5, true, "Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo - модель кроссовок, вдохновленная энергией и харизмой Зайона Уильямсона, сочетает в себе оригинальный дизайн и передовые технологии, что делает их идеальным выбором для настоящих ценителей. Уникальная цветовая палитра и детали, отражающие личность Зайона, делают эти кроссовки настоящим произведением искусства, которое выделит вас из толпы. Высококачественные материалы и продуманная конструкция обеспечивают отличную поддержку и комфорт при каждом движении, позволяя вам чувствовать себя уверенно в любой ситуации. Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo идеально подходят как для активного отдыха, так и для повседневной носки, добавляя вашему образу нотку спортивной элегантности.", new[] { "demand", "skate" }, "540d45d05a10887fce463570602c95c7", "Nike Air Jordan 1 Retro Low OG Zion Williamson Voodoo", 134990, new[] { "36 RU", "37 RU", "39 RU", "41 RU", "43 RU" } },
                    { 6, true, "Black Phantom выполнены в основном черном цвете, который придает им стильный и загадочный вид. Однако черный верх из кожаных и замшевых материалов дополнен контрастными акцентами, включая яркие детали, которые делают модель более заметной. Существует также элегантный логотип \"Cactus Jack\" на петле язычка. Верх кроссовок изготовлен из высококачественной кожи и замши, что обеспечивает долговечность и комфорт. Использование различных текстур материалов добавляет интересный визуальный эффект и делает обувь более привлекательной.", new[] { "demand", "skate" }, "959da7edcf47d920db135e258d4b5749", "Nike Air Jordan 1 Retro Low OG SP Travis Scott Black Phantom", 94990, new[] { "36 RU", "37 RU", "38 RU", "40 RU", "43 RU" } },
                    { 7, true, "Jordan 1 Low fragment design x Travis Scott – это новая пара в коллаборации японского дизайнера Хироши Фудживара и рэпера Трэвиса Скотта. Основа кроссовок из высококачественной белой кожи, на ее фоне выделяются черные детали, расположенные на носке и около шнурков. Главной особенностью дизайнов с участием Трэвиса Скотта является Swoosh в зеркальной ориентации, в данной модели в бежевом оттенке, как и шнурки и подошва. Акцентные элементы из синей кожи в области пятки. Релиз состоялся в августе 2021.", new[] { "demand", "skate" }, "a18efc63596ec33ccd28943c64e821e3", "Nike Air Jordan 1 Low Fragment x Travis Scott", 241900, new[] { "36 RU", "37 RU", "38 RU", "40 RU", "43 RU" } },
                    { 8, true, "Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha - уникальную модель, которая сочетает в себе элементы уличной культуры и высококачественный дизайн. Эти кроссовки идеально подойдут как для повседневной носки, так и для создания стильных образов.Уникальная цветовая схема в оттенках коричневого и бежевого, дополненная характерными деталями от Travis Scott, делает эту модель настоящим произведением искусства, которое привлечет внимание.Высококачественные материалы и продуманная конструкция обеспечивают отличную поддержку и комфорт, позволяя вам уверенно двигаться в любой ситуации. Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha идеально подходят для создания как спортивных, так и кэжуал-образов, добавляя вашему стилю нотку эксклюзивности.", new[] { "demand", "skate" }, "1e1d8f10e78ca8ca0d9835f1cdc6effb", "Nike Air Jordan 1 Retro Low OG SP Travis Scott Reverse Mocha", 251890, new[] { "36 RU", "37 RU", "38 RU", "40 RU", "43 RU" } },
                    { 9, true, "Nike Air Jordan 1 Low Dior - уникальную модель кроссовок, которая сочетает в себе элегантный дизайн и высокие технологии. Эти кроссовки станут идеальным дополнением вашего образа благодаря утонченному внешнему виду и качественным материалам.Выпущенные в ограниченном количестве, они выделяются из толпы благодаря эксклюзивным элементам, вдохновленным модой Dior.Премиальная кожа и подошва из ЭВА обеспечивают идеальную поддержку и мягкость при каждом шаге Nike Air Jordan 1 Low Dior идеально подходят как для повседневной носки, так и для особых случаев, придавая вашему наряду нотку роскоши", new[] { "skate" }, "afbcdd8defd959d8bd12188d9bea0a32", "Nike Air Jordan 1 Low Dior", 2345490, new[] { "40 RU", "42 RU" } },
                    { 10, true, "Nike Air Force 1 Low SP \"Tiffany & Co.\" — это специальная версия культовых кроссовок Air Force 1, созданная в сотрудничестве с известным ювелирным домом Tiffany & Co. Эта модель стала знаковой благодаря своим уникальным дизайнерским элементам и ограниченному выпуску, что сделало её одним из самых желанных предметов для коллекционеров и поклонников бренда. Nike Air Force 1 Low SP \"Tiffany & Co. — это не только стильное дополнение для гардероба, но и предмет коллекционирования, который олицетворяет как уличную культуру, так и элегантность, присущую ювелирному дому Tiffany. Эта модель быстро стала желанным объектом среди поклонников кроссовок и коллекционеров, благодаря своему эксклюзивному статусу и уникальному дизайну.", new[] { "skate" }, "56d1ef88ef8ba2ab91b2339e9cfb6f69", "Nike Air Force 1 Low SP Tiffany And Co.", 249990, new[] { "40 RU", "42 RU" } },
                    { 11, true, "The North Face Glenclyffe Low Vibram в цвете TNF Black — это стильная и функциональная обувь, предназначенная для активного отдыха и повседневного использования. Вот несколько ключевых характеристик и особенностей этой модели: Комфорт и поддержка, Подошва Vibram, Качественные материалы", new[] { "sneakers" }, "2effa9b53364d727786c20e1b601389a", "The North Face Glenclyffe Low Vibram TNF Black", 32990, new[] { "38 RU", "39 RU", "40 RU", "41 RU" } },
                    { 12, true, "Yeezy 500 High Sumac — легендарная модель Yeezy Boost 500 от Канье Уэста в новой расцветке. Основа кроссовок выполнена из сетчатого материала с вставками из кожи и замши различных оттенков коричневого и песочного. Акцентные ярко-красные шнурки, массивная подошва с технологией амортизации adiprene. Релиз состоялся в мае 2021 года.", new[] { "sneakers" }, "6e58c6390add21e2dc89c0427bada0aa", "Yeezy 500 High Sumac", 76990, new[] { "38 RU", "39 RU", "40 RU", "41 RU" } },
                    { 13, true, "Nike Lunar Force 1 High Duckboot Ale Brown Black - это мужская модель, изначально разработанная для игры в баскетбол. Модель Nike Lunar Force 1 High Duckboot в цветовом исполнении Ale Brown Black оснащена амортизирующей системой Air, обеспечивающей легкость и комфорт. От сырости и холода защищает высокий воротник, охватывающий щиколотку. Кроссовки имеют шнуровку, застежку-молнию и регулируемую ширину для плотной посадки. Верх выполнен из водостойкой кожи в области пятки и боковых накладок. На носке использована студированная синтетика. Эта модель сочетает в себе функциональность и стиль. Она одинаково подойдет как для активного отдыха, так и повседневной носки. Ее отличает универсальность и практичность в любую погоду.", new[] { "sneakers" }, "1585251a1776b6460b8d7c84fff951bd", "Nike Lunar Force 1 High Duckboot Ale Brown Black", 30790, new[] { "38 RU", "39 RU", "40 RU", "41 RU", "43 RU" } },
                    { 14, true, "", new[] { "uggy" }, "8083e87534bb6aa143ad597a2212cb82", "Timberland 3-Eye Lug Handsewn Boat Shoe Brown", 32490, new[] { "39 RU", "40 RU", "42 RU" } },
                    { 15, true, "", new[] { "uggy" }, "8070986a95e30ad15788e143eb5e7d56", "Timberland Heritage LNY 6 Inch", 19390, new[] { "39 RU", "40 RU", "42 RU" } },
                    { 16, true, "", new[] { "uggy" }, "912a187e12b2f3787e1cbe64e0f9decd", "Timberland x CLOT Future73 Timberloop 6-inch Boot Wheat", 90590, new[] { "39 RU", "40 RU", "43 RU" } },
                    { 17, true, "", new[] { "uggy" }, "1606f337e648c9a745562ea470c30be3", "UGG Classic Ultra Mini Boot Black (W)", 20190, new[] { "36 RU", "37 RU", "38 RU", "39 RU", "40 RU" } },
                    { 18, true, "", new[] { "uggy" }, "46317750139f5a30ed13626a9a22fec9", "UGG Classic Ultra Mini Boot Chestnut (W)", 20790, new[] { "36 RU", "37 RU", "38 RU", "39 RU", "40 RU" } }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "shopCartTableObj");

            migrationBuilder.DropTable(
                name: "shopImagesTableObj");

            migrationBuilder.DropTable(
                name: "shopItemsTableObj");

            migrationBuilder.DropTable(
                name: "shopOrderItemsTableObj");

            migrationBuilder.DropTable(
                name: "shopOrderTableObj");
        }
    }
}
