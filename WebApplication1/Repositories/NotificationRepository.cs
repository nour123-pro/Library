using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class NotificationRepository : GenericRepository<Notification>
    {
        public NotificationRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}