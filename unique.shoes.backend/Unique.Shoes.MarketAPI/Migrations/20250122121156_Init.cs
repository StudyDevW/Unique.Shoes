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
                    deliveryStatus = table.Column<string>(type: "text", nullable: false),
                    deliveryAddress = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shopOrderTableObj", x => x.hashPay);
                });

            migrationBuilder.InsertData(
                table: "shopItemsTableObj",
                columns: new[] { "id", "count", "description", "flags", "hashName", "name", "price", "sizes" },
                values: new object[] { 1, true, "Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W) — это уникальная версия классической модели кроссовок Air Jordan 1, созданная в сотрудничестве с популярным рэпером Трэвисом Скоттом.", new[] { "new" }, "e694bbbcd87f95e8a052f7369ac49304", "Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)", 79990, new[] { "36 RU", "41 RU" } });
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
