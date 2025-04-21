using System.Collections;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Models.Dto;
namespace WebApplication1.Repositories
{
    public class CommentRepository : GenericRepository<Comment>
    {
        public CommentRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Comment>> getbyCommentsforBookId(Guid Bookid){
            var comments = await _context.Comments
        .Where(c => c.borrowedBook.BookId == Bookid)
        .Include(c => c.borrowedBook)
            .ThenInclude(bb => bb.book)
        .Include(c => c.borrowedBook)
            .ThenInclude(bb => bb.account)
        .AsNoTracking()
        .ToListAsync();
            return comments;                        
        }
           
  public async Task<List<BookCommentCountDto>> GetNumber(){
       var result = await _context.Comments
    .Where(c => c.BorrowedBookId != null)
    .GroupBy(c => c.borrowedBook.BookId)
    .Select(group => new BookCommentCountDto 
    { 
        BookId = group.Key, 
        CommentsCount = group.Count()
    })
    .ToListAsync();

foreach (var item in result)
{
    Console.WriteLine($"BookId: {item.BookId}, CommentsCount: {item.CommentsCount}");
}
return result;

        }

      
    }
}