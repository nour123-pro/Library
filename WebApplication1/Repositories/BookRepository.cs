using System.ClientModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class BookRepository : GenericRepository<Book>
    {
        public BookRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IList<Book>> GettAllBooksWithCategories(){
            IList<Book> books=await _context.Books
                                     .AsNoTracking()
                                    .IncludeNavigationProperties()
                                  
                                    .Where(b=>b.isDeleted==false)
                                    .ToListAsync();
            return books;                        
        }

        public async Task<IList<Book>> GetBooks(){
              IList<Book> books=await _context.Books
                                     .AsNoTracking()
                                    .IncludeNavigationProperties()
                                  
                                    .ToListAsync();
            return books;
        }

        //get book by names
      public async Task<Book?> GetBookByNameAsync(string bookname)
{
    var book = await _context.Books
        .AsNoTracking()
        .IncludeNavigationProperties()  // Apply the IncludeNavigationProperties method here
        .FirstOrDefaultAsync(b => b.BookName == bookname);  // Ensure this is chained correctly

    return book;
}

    }
}