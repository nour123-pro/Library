using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class FavorableCategoryRepository : GenericRepository<FavorableCategory>
    {
        public FavorableCategoryRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}