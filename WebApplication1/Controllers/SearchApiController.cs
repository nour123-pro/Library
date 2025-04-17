using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using System.Threading.Tasks;
using System.Linq;

[ApiController]
[Route("api/Search")]
public class SearchController : ControllerBase
{
    private readonly DbContextOptions<ApplicationDbContext> _dbContextOptions;

    // Constructor
    public SearchController(DbContextOptions<ApplicationDbContext> dbContextOptions)
    {
        _dbContextOptions = dbContextOptions;
    }

    [HttpPost("Searching")]
    public async Task<ActionResult<SearchResult>> Search([FromBody] SearchingRequest searchingRequest)
    {
        // Validate request
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "bad", ModelState });
        }

        // Validate query string length
        if (string.IsNullOrWhiteSpace(searchingRequest.q) || searchingRequest.q.Length < 2)
        {
            return BadRequest("Query must be at least 2 characters.");
        }

        // Query logic for books, authors, and categories
        var booksTask = GetBooksAsync(searchingRequest.q);
        var authorsTask = GetAuthorsAsync(searchingRequest.q);
        var categoriesTask = GetCategoriesAsync(searchingRequest.q);

        // Wait for all tasks to complete
        await Task.WhenAll(booksTask, authorsTask, categoriesTask);

        // Prepare and return result
        var searchResult = new SearchResult
        {
            Books = booksTask.Result,
            Authors = authorsTask.Result,
            Categories = categoriesTask.Result
        };

        return Ok(searchResult);
    }

    // Helper Methods
    private async Task<List<Book>> GetBooksAsync(string query)
    {
        using (var context = new ApplicationDbContext(_dbContextOptions))
        {
            return await context.Books
                .Where(b => EF.Functions.Like(b.BookName, $"%{query}%") || EF.Functions.Like(b.BookDescription, $"%{query}%"))
                .Include(b => b.Author)
                .Include(b => b.Category)
                .Take(5)
                .ToListAsync();
        }
    }

    private async Task<List<Author>> GetAuthorsAsync(string query)
    {
        using (var context = new ApplicationDbContext(_dbContextOptions))
        {
            return await context.Author
                .Where(a => !a.isDeleted && EF.Functions.Like(a.AuthorName, $"%{query}%"))
                .Take(5)
                .ToListAsync();
        }
    }

    private async Task<List<Category>> GetCategoriesAsync(string query)
    {
        using (var context = new ApplicationDbContext(_dbContextOptions))
        {
            return await context.Categories
                .Where(c => !c.isDeleted && EF.Functions.Like(c.CategoryName, $"%{query}%"))
                .Take(5)
                .ToListAsync();
        }
    }
}


// SearchResult.cs
public class SearchResult
{
    public List<Book> Books { get; set; } = new List<Book>();
    public List<Author> Authors { get; set; } = new List<Author>();
    public List<Category> Categories { get; set; } = new List<Category>();
}