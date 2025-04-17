using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/Authors")]
    public class AuthorApiController : ControllerBase
    {
        private readonly AuthorRepository _authorRepository;

        public AuthorApiController(AuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
        }
        [HttpGet("AllAuthors")]
        public async Task<IActionResult> GetAllAuthors()
        {
            var result = await _authorRepository.GetAllAysc();
            return Ok(result);

        }
        [HttpPost("DeleteAuthor")]
        public async Task<IActionResult> DeleteAuthor([FromBody] DeleteAuthorRequest deleteAuthorRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = ModelState });
            }
            Author author = await _authorRepository.GetByIdAsync(Guid.Parse(deleteAuthorRequest.authorid));
            if (author == null)
            {
                return NotFound(new { message = "Author not found in database" });
            }
            _authorRepository.DeleteAuthor(Guid.Parse(deleteAuthorRequest.authorid));
            return Ok(new { message = "Successfully Deleted Author" });
        }

        [HttpPost("EditAuthorInfo")]
        public async Task<IActionResult> EditAuthor([FromBody] EditAuthorRequest authorRequest)
        {
            if(!ModelState.IsValid){
                return BadRequest(new { message = ModelState });
            }
            Author author = await _authorRepository.GetByIdAsync(Guid.Parse(authorRequest.authorid));
            if (author == null)
            {
                return NotFound(new { message = "Author not found in system" });
            }
            var base64Data = authorRequest.ImageBase64.Contains(",")
            ? authorRequest.ImageBase64.Split(',')[1]
            : authorRequest.ImageBase64;

            // Convert to bytes
            var imageBytes = Convert.FromBase64String(base64Data);
            if (imageBytes != null)
            {
                author.AuthorImage = imageBytes;
            }

            author.AuthorName = authorRequest.authorname;
            await _authorRepository.UpdateAsync(author);
            return Ok(new { message = "Successfully edited author" });
        }


       [HttpPost("CreateAuthor")]
       public async Task<IActionResult> AddAuthor([FromBody] CreateAuthorRequest createAuthorRequest){
          if(!ModelState.IsValid){
                return BadRequest(new { message = ModelState });
            }
            byte[] imageBytes = null;
            if (!string.IsNullOrEmpty(createAuthorRequest.ImageBase64))
{
    try 
    {
        // Extract just the Base64 portion
        var base64Data = createAuthorRequest.ImageBase64.Split(',')?.Last()?.Trim();
        
        // Validate length (Base64 should be divisible by 4)
        if (string.IsNullOrEmpty(base64Data) || base64Data.Length % 4 != 0)
            throw new FormatException();
            
        // Clean and convert
        var cleanBase64 = new string(base64Data.Where(c => 
            char.IsLetterOrDigit(c) || c == '+' || c == '/' || c == '='
        ).ToArray());
        
        imageBytes = Convert.FromBase64String(cleanBase64);
    }
    catch 
    {
        return BadRequest(new { message = "Invalid image data" });
    }
}
            Author author = new Author
            {
                AuthorId = Guid.NewGuid(),
                AuthorName = createAuthorRequest.authorname,
                AuthorImage = imageBytes,
                isDeleted=false,
                CreatedAt=DateTime.Now
            };
            await _authorRepository.AddAsync(author);
            return Ok(new { message = "Successfully Added New Author" });
        }






    }
};