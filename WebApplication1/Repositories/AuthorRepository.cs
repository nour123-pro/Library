using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class AuthorRepository : GenericRepository<Author>
    {
        public AuthorRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
        //soft delete author
        public async void DeleteAuthor(Guid authorid){
            Author? author = _context.Author.FirstOrDefault(b => b.AuthorId == authorid);
            if (author != null)
            {
                author.isDeleted = true;
                _context.SaveChanges();
            }


        }
    }
}