using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class RatingRepository : GenericRepository<Rating>
    {
        public RatingRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}