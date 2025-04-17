using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class CategoryRepository : GenericRepository<Category>
    {
        public CategoryRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public HashSet<KeyValuePair<string, int>> GetNumbers(){
             Dictionary<string, int> divt = new Dictionary<string, int>();
            IEnumerable<Category> categories = _context.Categories;
            IEnumerable<Book> books = _context.Books.Include(b=>b.Category);
            foreach (Category item in categories)
            {
                divt[item.CategoryName]=0 ;
            }
            foreach (Book item in books)
            {
                if(item.Category!=null && divt.ContainsKey(item.Category.CategoryName)){
                    divt[item.Category.CategoryName]+= 1;
                }
            }
            return divt.ToHashSet();


        }
    }
}