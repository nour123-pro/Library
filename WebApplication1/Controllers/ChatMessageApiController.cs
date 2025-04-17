using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/ChatMessages")]
    public class ChatMessageApiController:ControllerBase
    {
        private readonly ChatMessageRepository _chatMessageRepository;
        private readonly ChatRoomRepository _chatRoomRepository;
        private readonly AccountRepository _accountRepository;
      

        public ChatMessageApiController(ChatMessageRepository chatMessageRepository,ChatRoomRepository chatRoomRepository,AccountRepository accountRepository)
        {
            _chatMessageRepository = chatMessageRepository;
            _chatRoomRepository=chatRoomRepository;
            _accountRepository=accountRepository;
        }

        //getmessages for an chatroom
         [HttpPost("Messages")]
        public async Task<IActionResult> GetMessages([FromBody] ChatMessageRequest chatMessageRequest){
              if (chatMessageRequest == null || chatMessageRequest.chatroomid == null)
        return BadRequest("ChatRoomId is required");
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }
            ChatRoom chatRoom= await _chatRoomRepository.GetByIdAsync(Guid.Parse(chatMessageRequest.chatroomid));
            if(chatRoom==null){
                return NotFound(new{message="ChatRoom is not found in System"});
            }
            List<ChatMessage> chatMessages= await  _chatMessageRepository.ChatMessagesForChatRoomAsync(Guid.Parse(chatMessageRequest.chatroomid));
            return Ok(chatMessages);
        }

        [HttpPost("AddMessage")]
        public async Task<IActionResult> SaveNewMessage([FromBody] NewMessageRequest newMessageRequest){
           if(!ModelState.IsValid){
return BadRequest(ModelState);
           }
           Account account=await _accountRepository.GetByIdAsync(Guid.Parse(newMessageRequest.accountid));
           if(account==null){
            return NotFound(new{message="Account not found in System",success="true"});
           }
           ChatAccount chatAccount=await _chatMessageRepository.CheckAccountEnrolledIn(Guid.Parse(newMessageRequest.accountid),Guid.Parse(newMessageRequest.chatroomid));
           if(chatAccount==null){
            return NotFound(new{message="Unauthorized to write unless enrolled in",success="false"});
           };
           ChatMessage chatMessage=new ChatMessage{
            ChatAccountId=chatAccount.ChatAccountId,
            content=newMessageRequest.content,
            IsDeleted=false,
            CreatedAt=DateTime.Now
           
           };
           await _chatMessageRepository.AddAsync(chatMessage);
           return Ok(new{message="Successfully added new message",success="true"});

        }
 

    }
}