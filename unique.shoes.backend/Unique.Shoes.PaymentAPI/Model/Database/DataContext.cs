using Microsoft.EntityFrameworkCore;
using Unique.Shoes.Middleware.Database.DBO;

namespace Unique.Shoes.PaymentAPI.Model.Database
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

        public DbSet<PayTable> payTableObj { get; set; }

        public DbSet<BankCardTable> bankCardTableObj { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql(_connectionString);
            }

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BankCardTable>().HasData(
                new BankCardTable()
                {
                    id = 1,
                    cardNumber = "0000 1234 0000 4321",
                    cvv = "123",
                    moneyValue = 10000000
                }    
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
