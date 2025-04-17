using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserApiController:ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly AccountRepository _accountRepository;

        public UserApiController(UserRepository userRepository,IConfiguration configuration,AccountRepository accountRepository)
        {
            _userRepository = userRepository;
            _configuration=configuration;
            _accountRepository=accountRepository;
        }
        //login in calling
 
      [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // Attempt login
    var result = await _userRepository.Login(request.UserName, request.Password);

    // Handle bad request case (like validation errors)
    if (result is BadRequestObjectResult badRequest)
    {
        if (badRequest.Value is IEnumerable<IdentityError> identityErrors)
        {
            // Return detailed errors if any
            return BadRequest(identityErrors.Select(e => e.Description));
        }
    }

    // Generate JWT token if login was successful
    var token = GenerateJwtToken(request.UserName ?? throw new ArgumentException("Username cannot be null."));

    // Log the generated token (for debugging purposes, remove in production)
    Console.WriteLine("Generated Token: " + token);

    // Check the result and return corresponding response
    if (result is OkObjectResult ok)
    {
        // Return login successful with token
        return Ok(new 
        { 
            message = "Login successful", 
            data = ok.Value, 
            tokon = token 
        });
    }

    if (result is NotFoundObjectResult notFound)
    {
        // Handle Not Found response (user not found case)
        return NotFound(new { message = "User not found" });
    }
    if(result is NotFoundResult notFound1){
         return NotFound(new { message = "User not found" });
    }

    if (result is UnauthorizedResult unauthorized)
    {
        // Handle Unauthorized case (invalid credentials)
        return Unauthorized(new { message = "Invalid credentials" });
    }

    // Fallback for unexpected results (server error, etc.)
    return StatusCode(500, new { message = "An unexpected error occurred", details = result.GetType().Name });
}





  [HttpPost("SignUp")]
public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
{
    // 1. Validate if request is null or missing fields
    if (request == null)
    {
        return BadRequest(new { message = "Invalid request. Please provide user details." });
    }

    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
    {
        return BadRequest(new { message = "Username and Password are required." });
    }

    // 2. Parse DateOfBirth safely
    DateOnly dateOfBirth;
    try
    {
        dateOfBirth = DateOnly.Parse(request.DateOfBirth);
    }
    catch (FormatException)
    {
        return BadRequest(new { message = "Invalid DateOfBirth format. Expected format: YYYY-MM-DD." });
    }

    // 3. Call repository method and handle possible errors
    var result = await _userRepository.Signup(
        username: request.Username,
        password: request.Password,
        firstName: request.FirstName,
        lastName: request.LastName,
        gender: request.Gender,
        dateOfBirth: dateOfBirth
    );
     var token = GenerateJwtToken(request.Username ?? throw new ArgumentException("Username cannot be null."));

    // Log the generated token (for debugging purposes, remove in production)
    Console.WriteLine("Generated Token: " + token);
    // 4. Handle BadRequest and extract Identity Errors
    if (result is BadRequestObjectResult badRequest)
    {
        if (badRequest.Value is IEnumerable<IdentityError> identityErrors)
        {
            return BadRequest(new 
            { 
                message = "User creation failed.",
                errors = identityErrors.Select(e => e.Description) // More readable error response
            });
        }
    }

    // 5. Handle successful creation
    if (result is OkObjectResult ok)
    {
        return Ok(new 
        { 
            message = "User created successfully!", 
            data = ok.Value,
            tokon=token,
        });
    }

    // 6. Catch unexpected cases
    return StatusCode(500, new { message = "An unexpected error occurred.", errorType = result.GetType().Name });
}

           
   


    
     [HttpGet("ping")]
     public async Task<IActionResult> pingo(){
        return Ok("pingo");
     }



    



    private string GenerateJwtToken(string username)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

[HttpGet("AccountInfo")]
public async Task<ActionResult<AccountInfoDto>> GetAccountInfo([FromQuery] string username)
{
    if (_userRepository == null || _userRepository._userManager == null)
    {
        return StatusCode(500, new { message = "Internal server error: User repository not initialized" });
    }

    if (string.IsNullOrWhiteSpace(username))
    {
        return BadRequest(new { message = "Username is required" });
    }

    try
    {
        var user = await _userRepository._userManager.FindByNameAsync(username);
        if (user == null)
        {
            return NotFound(new { message = $"User not found: {username}" });
        }

        if (user.UserName == null)
        {
            return StatusCode(500, new { message = "User has no username" });
        }

        if (_accountRepository == null)
        {
            return StatusCode(500, new { message = "Internal server error: Account repository not initialized" });
        }

        var account = await _accountRepository.GetAccountByAccountName(user.UserName);
        if (account == null)
        {
            return NotFound(new { message = $"Account not found for user: {username}" });
        }

        return Ok(account);
    }
    catch (Exception ex)
    {
        
        return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
    }
}

// DTO for the response
public class AccountInfoDto
{
    public string UserName { get; set; }
    public string AccountName { get; set; }
    public string? Email { get; set; }
    public string? ProfileImage { get; set; } // Base64 encoded image
    public DateTime DateCreated { get; set; }
}



}
}