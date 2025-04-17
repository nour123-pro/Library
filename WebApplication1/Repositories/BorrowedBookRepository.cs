using System.ComponentModel;
using System.Diagnostics;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class BorrowedBookRepository : GenericRepository<BorrowedBook>
    {
        public BorrowedBookRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        //get bookborrowed for account by accountname
        public async Task<IEnumerable<BorrowedBook>> GetAllByAccountName(string accountname){
            Account account=await _context.Accounts
                                           .Include(u=>u.user)
                                           .FirstOrDefaultAsync(u=>u.AccountName==accountname);
            
            IEnumerable<BorrowedBook> result=await _context.BorrowedBooks.Where(u=>u.AccountId==account.AccountId)
                                                                           .Include(u=>u.book)
                                                                          .ToListAsync();
            return result;
        }


        public async Task<BorrowedBook> GetBorrowedBookForAccountAndBookId(Guid accountid,string bookid ){
               BorrowedBook borrowedBook = await _context.BorrowedBooks
    .FirstOrDefaultAsync(b => b.AccountId == accountid && b.BookId == Guid.Parse(bookid));
           return borrowedBook;
        }
    public async Task<BookAvailability> IsAvailable(Guid bookId)
{
    var lastBorrowed = await _context.BorrowedBooks
        .Where(b => b.book.BookId == bookId)
        .OrderByDescending(b => b.DateCreated) // More efficient than OrderBy + LastOrDefault
        .FirstOrDefaultAsync();

            // Book is available if:
            // 1. Never borrowed (lastBorrowed is null), OR
            // 2. Last borrow record shows it was returned
             if (lastBorrowed == null)
    {
        return new BookAvailability
        {
            IsAvailable = true, // or false, depending on your logic
            NextAvailability = DateOnly.FromDateTime(DateTime.Today)
        };
    }
    else
    {
        return new BookAvailability
        {
            IsAvailable = lastBorrowed.isReturned ?? false,
            NextAvailability = lastBorrowed.isReturned == true ? null : lastBorrowed.DueDate
    };
    }

         
        }

    }
}