
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

namespace WebApplication1.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    { 
        protected readonly ApplicationDbContext _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepository(ApplicationDbContext dbContext){
            _context=dbContext;
            _dbSet=_context.Set<T>();
        }
        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
           var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<T>> GetAllAysc()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(Guid id)
        {

            return await _dbSet.FindAsync(id);
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public void Detach<T>(T entity) 
{
    _context.Entry(entity).State = EntityState.Detached;
}


public async Task<T> GetWithNavigationAsync(Guid id)
    {
        // Dynamically include navigation properties
        var entity = await _dbSet
            .IncludeNavigationProperties()
            .FirstOrDefaultAsync(e => EF.Property<Guid>(e, "Id") == id);

        return entity;
    }

    }
}