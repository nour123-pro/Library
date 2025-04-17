namespace WebApplication1.Repositories
{
    public interface IGenericRepository<T> where T:class{
        Task<IEnumerable<T>> GetAllAysc();
        Task<T> GetByIdAsync(Guid id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(Guid id);
        Task<T> GetWithNavigationAsync(Guid id);
    }
}