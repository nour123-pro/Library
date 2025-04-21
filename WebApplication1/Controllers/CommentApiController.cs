using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/Comment")]
    public class CommentApiController:ControllerBase
    {
        private readonly CommentRepository _commentResp;
        private readonly AccountRepository _accountrepos;
        private readonly BorrowedBookRepository _borrowedBookRepository;

        public CommentApiController(CommentRepository commentResp,AccountRepository accountRepository,BorrowedBookRepository borrowedBookRepository)
        {
            _commentResp = commentResp;
            _accountrepos=accountRepository;
            _borrowedBookRepository=borrowedBookRepository;
        }

        //get comments based on book id
        [HttpGet("CommentsForBook")]
        public async Task<IActionResult> GetCommentsForBook([FromQuery] Guid Bookid){
            if(Bookid==null){
                return  BadRequest(new{message="Book id is null"});
            }
            IEnumerable<Comment> comments=await _commentResp.getbyCommentsforBookId(Bookid);
            
            return Ok(comments);
        }

        //adding an comment
        [HttpPost("AddingNewComment")]

        public async Task<IActionResult> SavingNewComment([FromBody] CommentRequest commentRequest){
           
            if(!ModelState.IsValid){
                return BadRequest(new{message="sent info for comment dont meet standards",ModelState});
            }
            Account account=await _accountrepos.GetAccountByAccountName(commentRequest.username);
              
            if(account==null){
                return NotFound(new{message="Account not found"});
            }
             BorrowedBook borrowedBook=await _borrowedBookRepository.GetBorrowedBookForAccountAndBookId(account.AccountId,commentRequest.bookid);
             if(borrowedBook==null){
                return BadRequest(new{message="you are not allowed to comment"});
             }
            Comment comment=new Comment{
                CommentContent=commentRequest.commenttext,
                CreatedAt=DateTime.Now,
                BorrowedBookId=borrowedBook.BorrowedBookId,
                
                IsDeleted=false
            };
            await _commentResp.AddAsync(comment);
            return Ok(new{message="Thank you for your feedback ;>"});
        }

         [HttpPost("deleteComment")]
        //delete a comment
        public async Task<IActionResult> DeleteComment([FromBody] DeleteCommentRequest deleteCommentRequest){
            Comment comment=await _commentResp.GetByIdAsync(Guid.Parse(deleteCommentRequest.commentid));
            if(comment==null){
                return NotFound(new{message="Comment not found in System"});
            }
            await _commentResp.DeleteAsync(Guid.Parse(deleteCommentRequest.commentid));
            return Ok(new{message="Comment Deleted Successfully"});
        }

        [HttpGet("NumbersForBooks")]
        public async Task<IActionResult> GetItRight(){
            var response = await _commentResp.GetNumber();
            return Ok(response);
        }
    }
}