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

            modelBuilder.Entity<ShopItemsTable>().HasData(
                new ShopItemsTable() 
                { 
                  id = 1, 
                  hashName = "e694bbbcd87f95e8a052f7369ac49304",
                  name = "Nike Air Jordan 1 Retro Low OG SP Travis Scott Olive (W)",
                  description = "Nike Air Jordan 1 Retro Low OG SP " +
                  "Travis Scott Olive (W) — это уникальная версия классической модели кроссовок Air Jordan 1, " +
                  "созданная в сотрудничестве с популярным рэпером Трэвисом Скоттом.",
                  flags = new string[] { "new" },
                  count = true,
                  price = 79990,
                  sizes = new string[] { "36 RU", "41 RU" }
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
