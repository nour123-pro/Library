using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System.Globalization;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class AccountRepository : GenericRepository<Account>
    {
        private readonly ApplicationDbContext _context;

        public AccountRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
            _context = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        //get account by account namespace
        public async Task<Account?> GetAccountByAccountName(string accountName)
{
    if (string.IsNullOrWhiteSpace(accountName))
    {
        throw new ArgumentException("Account name cannot be empty", nameof(accountName));
    }

    return await _context.Accounts
        .Include(a => a.user) // Include related user if needed
        .FirstOrDefaultAsync(a => a.AccountName == accountName);
}
    
    

public async Task<Dictionary<string, int>> GetAccountsCreatedPerMonth()
{
    // Initialize map with all months set to 0
    Dictionary<string, int> map = new Dictionary<string, int>();
    for (int i = 1; i <= 12; i++)
    {
        string monthName = new DateTime(1, i, 1).ToString("MMMM");
        map[monthName] = 0;
    }

    // Get all accounts from the database
    IEnumerable<Account> accounts = await _context.Accounts.ToListAsync();

    // Count accounts per month
    foreach (Account item in accounts)
    {
        string monthName = item.DateCreated.ToString("MMMM"); // e.g., "January"
        if (map.ContainsKey(monthName))
        {
            map[monthName]++;
        }
    }

    return map;
}

public async Task<int> GetNumberComments(string accountname){
            int numbercomments = await _context.Comments.CountAsync(c => c.borrowedBook.account.AccountName == accountname);
            return numbercomments;
        }



        }

  

    
    }
