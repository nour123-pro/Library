
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Repositories
{
public static class DbSetExtensions
{
    public static IQueryable<TEntity> IncludeNavigationProperties<TEntity>(this IQueryable<TEntity> query) where TEntity : class
    {
        var entityType = typeof(TEntity);
        var navigationProperties = entityType.GetProperties()
            .Where(p => p.PropertyType.IsClass && p.PropertyType != typeof(string) &&p.PropertyType!=typeof(byte[]))
            .ToList();

        foreach (var property in navigationProperties)
        {
            query = query.Include(property.Name);
        }

        return query;
    }
}


}
