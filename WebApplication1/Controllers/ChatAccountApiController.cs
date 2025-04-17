using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/ChatAccount")]
    public class ChatAccountApiController:ControllerBase
    {

        private readonly ChatAccountRepository _chatAccountRepository;
        private readonly ChatRoomRepository _chatRoomRepository;
        private readonly AccountRepository _accountRepository;

        public ChatAccountApiController(ChatAccountRepository chatAccountRepository,ChatRoomRepository chatRoomRepository,AccountRepository accountRepository)
        {
            _chatAccountRepository = chatAccountRepository;
            _chatRoomRepository=chatRoomRepository;
            _accountRepository=accountRepository;
        }

        //saving an new chat ChatAccount
        [HttpPost("AddNewChatAccount")]
        public async Task<IActionResult> AddNewChatAccount([FromBody] ChatAccountRequest chatAccountRequest){
            if(chatAccountRequest.chatroomid==null){
                return BadRequest("chatroom id cannot be null");
            }
             if(chatAccountRequest.username==null){
                return BadRequest("username cannot be null");
            }
             if(!ModelState.IsValid){
                return BadRequest(new { message = ModelState });
        }
            ChatRoom chatRoom=await _chatRoomRepository.GetByIdAsync(Guid.Parse(chatAccountRequest.chatroomid));
            if(chatRoom==null){
                return NotFound(new{message="ChatRoom is unavailable in the system"});
            }
            Account account=await _accountRepository.GetAccountByAccountName(chatAccountRequest.username);
            if(account==null){
                return NotFound(new{message="Account is unavailable in the system"});
            }
            ChatAccount newchataccount=new ChatAccount{
               ChatRoomId=chatRoom.ChatRoomId,
                AccountId=account.AccountId,
                DateCreated=DateTime.Now,
                isDeleted=false
            };
            await _chatAccountRepository.AddAsync(newchataccount);
        return Ok(new{message="Enrolled Successfully in ChatRoom",success="true"});
        }


       
       
[HttpPost("DeleteChatAccount")]
public async Task<IActionResult> DeleteChatAccount([FromBody] ChatAccountRequest chatAccountRequest)
{
    // Early validations
    if (chatAccountRequest.chatroomid == null) return BadRequest("Chatroom ID cannot be null");
    if (chatAccountRequest.username == null) return BadRequest("Username cannot be null");
    if (!Guid.TryParse(chatAccountRequest.chatroomid, out var chatRoomId))
        return BadRequest("Invalid Chatroom ID format");
    if (!ModelState.IsValid) return BadRequest(new { message = ModelState });
     Account account=await _accountRepository.GetAccountByAccountName(chatAccountRequest.username);
    // Combined lookup
    var chatAccountToDelete = await _chatAccountRepository
        .GetChatAccountByChatRoomAndAccountIdAsync(chatRoomId, account.AccountId);

    if (chatAccountToDelete == null)
        return NotFound(new { message = "ChatAccount not found for the given chatroom and username" });

    await _chatAccountRepository.DeleteAsync(chatAccountToDelete.ChatAccountId);
    return Ok(new { message = "Enrollment in the ChatRoom has been canceled",success="true" });
}
        
         
[HttpPost("IsEnrolledInChatRoom")]
public async Task<IActionResult> IsEnrolledInChatRoom([FromBody] ChatAccountRequest chatAccountRequest){
     if (chatAccountRequest.chatroomid == null) return BadRequest("Chatroom ID cannot be null");
    if (chatAccountRequest.username == null) return BadRequest("Username cannot be null");
    if (!Guid.TryParse(chatAccountRequest.chatroomid, out var chatRoomId))
        return BadRequest("Invalid Chatroom ID format");
    if (!ModelState.IsValid) return BadRequest(new { message = ModelState });
     Account account=await _accountRepository.GetAccountByAccountName(chatAccountRequest.username);
    // Combined lookup
    var chatAccountexisted = await _chatAccountRepository
        .GetChatAccountByChatRoomAndAccountIdAsync(chatRoomId, account.AccountId);
   if(chatAccountexisted!=null){
    return Ok(new{Enrolled=true});
   }else{
    return Ok(new{Enrolled=false});
   }

}

[HttpPost("Subscribers")]
public async Task<IActionResult> SubscibersInChatRoom([FromBody] ChatRoomSubscibersRequest chatRoomSubscibersRequest){
    if (chatRoomSubscibersRequest.chatroomid == null)
    {
        return BadRequest("chatroomid cannot be null");
    }

    if(!ModelState.IsValid){
        return BadRequest(ModelState);
    }
    ChatRoom chatRoom=await _chatRoomRepository.GetByIdAsync(Guid.Parse(chatRoomSubscibersRequest.chatroomid));
    if(chatRoom==null){
       return NotFound(new{message="ChatRoom not found in System"});
    }
    IEnumerable<Account> accounts=await  _chatAccountRepository.GetSubscribersForChatRoom(chatRoom.ChatRoomId);
    return Ok(accounts);

}
[HttpPost("GetNumberChatRoomsForAccount")]
public async Task<IActionResult> GetNumberChatRoomsForAccount([FromBody] ChatRoomsNumberRequest chatRoomsNumberRequest){
            var reponse = await _chatAccountRepository.GetNumberChatRoomsForAccount(chatRoomsNumberRequest.accountname);
            return Ok(reponse);
        }

}
}