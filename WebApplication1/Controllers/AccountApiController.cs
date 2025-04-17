using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/Account")]
    public class AccountApiController:ControllerBase
    {
        private readonly UserManager<User> _userManager;
        public readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly AccountRepository _accountRepository;
        private readonly FavorableCategoryRepository _favorableCategoryRepos;
        private readonly UserRepository _userRepository;
        private readonly IWebHostEnvironment _env;
        public AccountApiController(AccountRepository accountRepository,FavorableCategoryRepository favorableCategoryRepository,UserRepository userRepository,ApplicationDbContext applicationDbContext,UserManager<User> userManager,SignInManager<User> signInManager,IWebHostEnvironment webHost)
        {
            _accountRepository = accountRepository;
            _favorableCategoryRepos=favorableCategoryRepository;
            _userRepository=userRepository;
            _applicationDbContext=applicationDbContext;
            _userManager=userManager;
            _signInManager=signInManager;
            _env=webHost;

        }

       
      

      [HttpPost("EditAccountInfo")]
public async Task<IActionResult> EditAccountInfo([FromBody] EditAccountInfoRequest editAccountInfoRequest)
{
    // Validate request
    if (!ModelState.IsValid)
    {
        return BadRequest(new { message = "Invalid request data" });
    }

    // Find account by old username
    Account account = await _accountRepository.GetAccountByAccountName(editAccountInfoRequest.oldusername);
    if (account == null)
    {
        return NotFound(new { message = "Account not found" });
    }

    // Get associated user
    User user = await _userManager.FindByIdAsync(account.UserId.ToString());
    if (user == null)
    {
        return NotFound(new { message = "User not found" });
    }

    // Verify new username doesn't exist (excluding current user)
    if (editAccountInfoRequest.newusername != user.UserName)
    {
        var existingUser = await _userManager.FindByNameAsync(editAccountInfoRequest.newusername);
        if (existingUser != null)
        {
            return BadRequest(new { message = "New username already taken" });
        }
    }

    try
    {
   
     // Convert Base64 to image if exists
if (!string.IsNullOrEmpty(editAccountInfoRequest.ImageBase64))
{
    try
    {
        // Validate Base64 format
        if (!editAccountInfoRequest.ImageBase64.StartsWith("data:image/"))
        {
            throw new ArgumentException("Invalid Base64 image format");
        }

        // Extract the Base64 portion
        var base64Data = editAccountInfoRequest.ImageBase64.Contains(",") 
            ? editAccountInfoRequest.ImageBase64.Split(',')[1] 
            : editAccountInfoRequest.ImageBase64;

        // Convert to bytes
        var imageBytes = Convert.FromBase64String(base64Data);

        /**Validate image size (e.g., max 5MB)
        if (imageBytes.Length > 5 * 1024 * 1024)
        {
            
             return BadRequest(new { message = "Image size exceeds 5MB limit" });
        }**/

        // Ensure upload directory exists
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Generate file path
        var fileName = $"{Guid.NewGuid()}.jpg";
        var filePath = Path.Combine(uploadsFolder, fileName);

        // Save file
        await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

        // Update account
        account.AccountProfileImageUrl = $"/Uploads/ProfileImages/{fileName}"; // Web-accessible path
        account.AccountProfileImage = imageBytes;
    }
    catch (FormatException ex)
    {
        // Handle invalid Base64
       
        return BadRequest(new { message = "Image size exceeds 5MB limit" });
    }
    catch (Exception ex)
    {
         return BadRequest(new { message = "Error processing image" });
      
    }
}
           
       

        // Update username if changed
        if (editAccountInfoRequest.newusername != user.UserName)
        {
            var setUsernameResult = await _userManager.SetUserNameAsync(user, editAccountInfoRequest.newusername);
            if (!setUsernameResult.Succeeded)
            {
                return BadRequest(new { 
                    message = "Failed to update username", 
                    errors = setUsernameResult.Errors 
                });
            }
            
            // Security updates for username change
            await _userManager.UpdateSecurityStampAsync(user);
            account.AccountName = editAccountInfoRequest.newusername;
        }

        // Update favorite category if provided
        if (!string.IsNullOrEmpty(editAccountInfoRequest.selectedcategoryid))
        {
            var favorableCategory = new FavorableCategory
            {
                CategoryId = Guid.Parse(editAccountInfoRequest.selectedcategoryid),
                AccountId = account.AccountId
            };
            await _favorableCategoryRepos.AddAsync(favorableCategory);
        }

        await _applicationDbContext.SaveChangesAsync();
        await _signInManager.RefreshSignInAsync(user);

        return Ok(new { message = "Account updated successfully" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { 
            message = "An error occurred", 
            error = ex.Message,
            stackTrace = ex.StackTrace
        });
    }
}

private async Task<string> SaveImage(IFormFile image)
{
    var uploadsFolder = Path.Combine("Uploads", "ProfileImages");
    if (!Directory.Exists(uploadsFolder))
    {
        Directory.CreateDirectory(uploadsFolder);
    }

    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

    using (var fileStream = new FileStream(filePath, FileMode.Create))
    {
        await image.CopyToAsync(fileStream);
    }

    return filePath;
}




  [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        if(!ModelState.IsValid){
            return BadRequest("no");
        }
        if (image == null || image.Length == 0)
            return BadRequest("No file uploaded");

        // Validate file type and size if needed
        if (!image.ContentType.StartsWith("image/"))
            return BadRequest("Only image files are allowed");

        // Define where to save the file
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        
        // Create directory if it doesn't exist
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        // Create a unique file name to prevent overwrites
        var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // Save the file
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(fileStream);
        }

        // Return success response with file info
        return Ok(new { 
            fileName = uniqueFileName,
            fileSize = image.Length,
            filePath = filePath
        });
    }


[HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { 
            imageUrl = $"/Uploads/ProfileImages/{fileName}" 
        });
    }
    [HttpGet("UsersPerMonth")]
    public async Task<IActionResult> GetUsersPerMonth(){
            var result =await  _accountRepository.GetAccountsCreatedPerMonth();
            return Ok(result);
        }
  [HttpPost("Comments")]
   public async Task<IActionResult> GetCommentsNumberForAccount([FromBody] CommentsForProfileRequest commentsForProfileRequest){
            var reponse = await  _accountRepository.GetNumberComments(commentsForProfileRequest.accountname);
            return Ok(reponse);
        }
}
}