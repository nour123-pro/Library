using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class UserRepository : GenericRepository<User>
    {
        public readonly UserManager<User> _userManager;
        public readonly SignInManager<User> _signInManager;
        public readonly AccountRepository _accountrep;

        public UserRepository(ApplicationDbContext dbContext, UserManager<User> userManager, SignInManager<User> signInManager,AccountRepository accountRepository)
            : base(dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _accountrep=accountRepository;
        }

        // Get user by name
        public async Task<ActionResult<User>> GetUserByName(string username)
        {
            // Use await to asynchronously query the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.FirstName == username);

            // Check if the user was found
            if (user == null)
            {
                return new NotFoundResult();  // Returns a 404 Not Found response
            }

            // Return the user with a 200 OK status
            return user;
        }

        // Authentication logic
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return new  NotFoundResult();
            }

            var result = await _signInManager.PasswordSignInAsync(user, password, false, false);
            if (!result.Succeeded)
            {
                return  new UnauthorizedResult();
            }

            return new OkObjectResult("Login successful");
        }

        // Signup logic
        public async Task<IActionResult> Signup(string username, string password, string firstName, string lastName, DateOnly dateOfBirth, string gender)
        {
            // Ensure gender is valid (assuming Gender enum is present in User model)
           


            User user = new User
            {
                UserName = username,
                FirstName = firstName,
                LastName = lastName,
                BirthDate = dateOfBirth,
                Gender =Gender.Female, // Use parsed gender enum
                DateCreated = DateTime.UtcNow,
                isDeleted = false
            };

            var result = await _userManager.CreateAsync(user, password);
            Account account=new Account{
                   UserId=user.Id,
                   AccountName=user.UserName,
                   DateCreated=DateTime.Now,
                   isDeleted=false
            };
            await _accountrep.AddAsync(account);
            if (result.Succeeded)
            {
                return new OkObjectResult(new { Message = "User created successfully" });
            }

            return new BadRequestObjectResult(result.Errors);
        }

        
    }
}
