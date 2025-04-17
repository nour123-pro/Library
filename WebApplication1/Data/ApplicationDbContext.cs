using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;


namespace WebApplication1.Data
{
    // Derive from IdentityDbContext to include ASP.NET Core Identity features
    public class ApplicationDbContext :IdentityDbContext<User, IdentityRole<Guid>, Guid> 
    {
        // Constructor that accepts DbContextOptions and passes it to the base class
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public ApplicationDbContext()
        {
        }

        // Override OnModelCreating to configure custom model rules
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // You can add custom configurations here if necessary
            // For example, configuring table names or relationships.
            //builder.Entity<User>()
              //  .HasIndex(u => u.Email)
                //.IsUnique(); // Example: Making Email unique for the User entity
        }

        // Override OnConfiguring to configure options like lazy loading
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Enable Lazy Loading Proxies for navigation properties
                optionsBuilder.UseLazyLoadingProxies();
            }

            base.OnConfiguring(optionsBuilder);
        }

        // Define DbSet 
        public DbSet<Rating> Ratings{get;set;}
        public DbSet<FavorableCategory> FavorableCategories{get;set;}

        public DbSet<Book> Books { get; set; }
        public DbSet<BorrowedBook> BorrowedBooks { get; set; }
        public DbSet<Account> Accounts{get;set;}
        public DbSet<Category> Categories{get;set;}
        public DbSet<Comment> Comments{get;set;}
        public DbSet<ChatAccount> ChatAccounts{get;set;}
        public DbSet<ChatMessage> ChatMessages{get;set;}
        public DbSet<ChatRoom> ChatRooms{get;set;}
        public DbSet<Notification> Notifications{get;set;}
        public DbSet<Author> Author{get;set;}
       
       
    }
}
