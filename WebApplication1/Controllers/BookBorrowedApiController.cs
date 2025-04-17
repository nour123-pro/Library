using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Repositories;

namespace WebApplication1.Models
{
    [ApiController]
    [Route("api/BorrowedBooks")]
    public class BookBorrowedApiController:ControllerBase
    {

         private readonly BorrowedBookRepository _borrowedBookRepository;
         private readonly AccountRepository _accountrepository;
         private readonly BookRepository _bookrepository;

        public BookBorrowedApiController(BorrowedBookRepository borrowedBookRepository,AccountRepository accountRepository,BookRepository bookRepository)
        {
            _borrowedBookRepository = borrowedBookRepository;
            _accountrepository=accountRepository;
            _bookrepository=bookRepository;
        }

         [HttpGet("GetBorrowedBooks")]
        public async Task<IActionResult> GetBorrowedBooks(){
            var result=await _borrowedBookRepository.GetAllAysc();;
            return Ok(result);
        }
        //getborrowedBook for this account
        [HttpGet("BorrowedBooksForAccount")]
        public async Task<IActionResult> GetBorrowedBookForAccountName([FromQuery] string accountname){
            Account account=await _accountrepository.GetAccountByAccountName(accountname);
            if(account==null){
                return NotFound(new{message="AccountName not found in database"});
            }
            IEnumerable<BorrowedBook> borrowedBooks=await _borrowedBookRepository.GetAllByAccountName(accountname);
           
            return Ok(borrowedBooks);
        }

      
        [HttpGet("ConfirmBorrowingBook")]
        [AllowAnonymous]
public async Task<IActionResult> ConfirmBorrowingBookForAccount([FromQuery] BorrowingRequest borrowingRequest)
{
    
    if(!ModelState.IsValid){
        return BadRequest(ModelState);
    }
    // Validate request
    if(borrowingRequest == null)
    {
        return BadRequest(new { message = "Request body is required" });
    }

    if(string.IsNullOrWhiteSpace(borrowingRequest.accountname))
    {
        return BadRequest(new { message = "Account name is required" });
    }

    if(string.IsNullOrWhiteSpace(borrowingRequest.bookid) || !Guid.TryParse(borrowingRequest.bookid, out var bookId))
    {
        return BadRequest(new { message = "Valid Book ID is required" });
    }

    if(string.IsNullOrWhiteSpace(borrowingRequest.returningdate) || 
       !DateOnly.TryParse(borrowingRequest.returningdate, out var dueDate))
    {
        return BadRequest(new { message = "Valid return date is required" });
    }

    // Get account
    var account = await _accountrepository.GetAccountByAccountName(borrowingRequest.accountname);
    if(account == null)
    {
        return NotFound(new { message = "Account not found" });
    }

    // Get book
    var book = await _bookrepository.GetByIdAsync(bookId);
    if(book == null)
    {
        return NotFound(new { message = "Book not found" });
    }

    
    // Create new borrow record
    var borrowedBook = new BorrowedBook
    {
        BookId = bookId,
        AccountId = account.AccountId,
        DueDate = dueDate,
        DateCreated = DateTime.Now,
       
    };

    await _borrowedBookRepository.AddAsync(borrowedBook);
    
    // Update book availability
    
    await _bookrepository.UpdateAsync(book);

    return Ok(new { 
        message = "Successfully borrowed book",
        dueDate = dueDate.ToString("yyyy-MM-dd")
    });
}


[HttpGet("Check")]

public async Task<IActionResult> IsAvailable([FromQuery ]string bookid )
{
     if (!Guid.TryParse(bookid, out var bookId))
        return BadRequest("Invalid GUID format");
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState); // More appropriate status code for invalid requests
    }
    
    try
    {
        var result = await _borrowedBookRepository.IsAvailable(bookId);
        return Ok(result);
    }
    catch (FormatException)
    {
        return BadRequest("Invalid book ID format");
    }
}


    
    
    
    
    
    
    
    }


   

  
   
}