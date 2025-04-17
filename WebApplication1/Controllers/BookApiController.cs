using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [Route("api/Book")]
    [ApiController]
    public class BookApiController:ControllerBase
    {
        private readonly BookRepository _bookrespo;

        public BookApiController(BookRepository bookrespo)
        {
            _bookrespo = bookrespo;
        }
        [HttpGet]
        public async Task<IActionResult> getBookById([FromQuery(Name = "bookid")]Guid bookid){
            
             if (bookid == Guid.Empty)
    return BadRequest(new { message = "Invalid book ID" });
         try{
           
               var book=await _bookrespo.GetByIdAsync(bookid);
           if(book!=null){
            return Ok(new {message="found book",book});
           }else{
              return NotFound(new{message="didnot found book"});
           }
           
         }catch(Exception ex){
 return StatusCode(500,new{message=$"{ex.Message}"});
         }
            
           
          

        }

       
       [HttpGet("getByBookName")]
       public async Task<IActionResult> getBookByName([FromBody] BookNameFinder bookNameFinder){
        var bookname=bookNameFinder.bookname;
         var book=await _bookrespo.GetBookByNameAsync(bookname);
         if(book!=null){
            return Ok(book);
         }else{
            return NotFound(new{message="Book not found in system"});
         }
       }
       
      public class BookNameFinder(){
        public string bookname{get;set;}
      }

       [HttpPut("AddBook")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> AddBook([FromBody] Book book)
{
    // Validate model
    if (!ModelState.IsValid)
    {
        return BadRequest(new {
            Message = "Invalid book data",
            Errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
        });
    }

    try
    {
        await _bookrespo.AddAsync(book);
        return Ok(new { 
            Message = "Book added successfully", 
            BookId = book.BookId 
        });
    }
    catch (Exception ex)
    {
        // Log the error (you should inject ILogger)
        return StatusCode(StatusCodes.Status500InternalServerError, new {
            Message = "Failed to add book",
            Error = ex.Message
        });
    }
}
    
    
    [HttpPut("UpdateBook")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> UpdateBook([FromBody] Book book)
{
    if (book == null || book.BookId == Guid.Empty)
    {
        return BadRequest(new
        {
            message = "Invalid book data provided"
        });
    }

    var bookwanted = await _bookrespo.GetByIdAsync(book.BookId);
    if (bookwanted == null)
    {
        return NotFound(new
        {
            message = $"Book with ID {book.BookId} not found"
        });
    }

    try
    {
         _bookrespo.Detach(bookwanted); // ⬅️ Detach the existing entity
        await _bookrespo.UpdateAsync(book);
        return Ok(new
        {
            message = $"Book {book.BookId} was successfully updated"
        });
    }
    catch (Exception ex)
    {
        // You may want to log the error here using a logging framework
        return StatusCode(StatusCodes.Status500InternalServerError, new
        {
            message = "Failed to update book",
            error = ex.Message
        });
    }
}

    
   [HttpDelete("DeleteBook")]
   public async Task<IActionResult> DeleteBook([FromQuery(Name ="BookId")]Guid BookId){
       
 Book existingbook=await _bookrespo.GetByIdAsync(BookId);
       if(existingbook==null){
        return NotFound(new{message="Book is not found in database"});

       }
       await _bookrespo.DeleteAsync(BookId);
       return Ok(new {message="Book deleted successfully"});
      
      

   }

   [HttpGet("allbooks")]
   public async Task<IActionResult> GetAllBooks(){
    IEnumerable<Book> books=await _bookrespo.GettAllBooksWithCategories();
    if(books!=null){
        return Ok(books);
    }
    return NotFound(new{message="No books in database"});

   }

   [HttpGet("allbooksWithSoftDelete")]
   public async Task<IActionResult> GetAllBooksWithSoftDelete(){
    IEnumerable<Book> books=await _bookrespo.GetBooks();
    if(books!=null){
        return Ok(books);
    }
    return NotFound(new{message="No books in database"});

   }
   [HttpPost("EditBook")]
   public async  Task<IActionResult> EditBook([FromBody] BookEditRequest bookEditRequest){
    if(bookEditRequest.bookauthorid==null){
         return BadRequest(new { message = "book id cannot be null" });
    }
    if(!ModelState.IsValid){
        return BadRequest(new { message = ModelState });
     }
            Book book = await _bookrespo.GetByIdAsync(Guid.Parse(bookEditRequest.bookid));
            if(book==null){
                return NotFound(new { message = "Book not found in database" });
            }
            book.AuthorId = Guid.Parse(bookEditRequest.bookauthorid);
            book.BookDescription = bookEditRequest.bookdescription;
            book.BookName = bookEditRequest.bookname;
            book.CategoryId = Guid.Parse(bookEditRequest.categoryid);
            if(bookEditRequest.imageBase64!=null){
   book.BookImages=Convert.FromBase64String(bookEditRequest.imageBase64);
            }
            

           await  _bookrespo.UpdateAsync(book);
            return Ok(new { message = "Successfully Updated Book Info" });
        }

[HttpPost("CreateBook")]
public async Task<IActionResult> CreateBook([FromBody] CreateBookRequest createBookRequest)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(new { 
            message = "Validation failed",
            errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
        });
    }

    try
    {
        // Validate GUIDs
        if (!Guid.TryParse(createBookRequest.bookauthorid, out var authorId) ||
            !Guid.TryParse(createBookRequest.categoryid, out var categoryId))
        {
            return BadRequest(new { message = "Invalid author or category ID format" });
        }

        // Validate base64 if provided
        byte[] imageBytes = null;
        if (!string.IsNullOrEmpty(createBookRequest.imageBase64))
        {
            try
            {
                imageBytes = Convert.FromBase64String(createBookRequest.imageBase64);
            }
            catch (FormatException)
            {
                return BadRequest(new { message = "Invalid image format" });
            }
        }

        var book = new Book
        {
            BookName = createBookRequest.bookname,
            BookDescription = createBookRequest.bookdescription,
            BookImages = imageBytes,
            AuthorId = authorId,
            CategoryId = categoryId,
            BookId = Guid.NewGuid(),
        };

        await _bookrespo.AddAsync(book);
        
        return CreatedAtAction(nameof(CreateBook), new { 
            message = "Book Created Successfully",
            bookId = book.BookId
        });
    }
    catch (Exception ex)
    {
        // Log the exception
      
        return StatusCode(500, new { message = "An error occurred while creating the book" });
    }
}

[HttpPost("SoftDelete")]
public async Task<IActionResult> SoftDeleteBook([FromBody] BookDeleteRequest bookDeleteRequest){
    if(!ModelState.IsValid){
                return BadRequest(new { message = ModelState });
            }
            Book book = await _bookrespo.GetByIdAsync(Guid.Parse(bookDeleteRequest.bookid));
            if(book==null){
                return NotFound(new { message = "Book not found in database" });
            }
            book.isDeleted = true;
            await _bookrespo.UpdateAsync(book);

            return Ok("Successfully Deleted Book");
        }

   
         
    }

}