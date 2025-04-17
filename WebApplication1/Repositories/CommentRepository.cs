using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

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
    }
}