
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Repositories;

namespace WebApplication1.Models
{
    [ApiController]
    [Route("api/Rating")]
    public class RatingApiController:ControllerBase

    {
        
        private readonly RatingRepository _ratingrepos;
        private readonly BorrowedBookRepository _borrowedBookRepository;
        private readonly AccountRepository _accountRepository;
        public RatingApiController(RatingRepository ratingrepos,BorrowedBookRepository borrowedBookRepository,AccountRepository accountRepository)
        {
            _ratingrepos = ratingrepos;
            _borrowedBookRepository=borrowedBookRepository;
            _accountRepository=accountRepository;

        }
        [HttpPost("RatingBook")]
        public async Task<IActionResult> RatingBook([FromBody] RatingrRequest ratingrRequest){
            Account account=await _accountRepository.GetAccountByAccountName(ratingrRequest.username);
            if(account==null){
                return  NotFound(new{message="Account not found in System"});
            }
             BorrowedBook borrowedBook=await _borrowedBookRepository.GetBorrowedBookForAccountAndBookId(account.AccountId,ratingrRequest.bookid);
             if(borrowedBook==null){
                return  NotFound(new{message="Unauthorized to rating."});
             }
             RatingValue ratingValue = (RatingValue)int.Parse(ratingrRequest.ratingvalue);
             if(borrowedBook!=null){
               Rating ratins=new Rating{
                 RatingGuid = Guid.NewGuid(),
                BorrowedBookId=borrowedBook.BorrowedBookId,
                RatingValue=ratingValue,
                CreatedAt=DateTime.Now

             };
             await _ratingrepos.AddAsync(ratins);
             return   Ok(new{message="Thank you for your rating"});
             }
             return Ok(new{message="NET"});
            
        }
    }
}