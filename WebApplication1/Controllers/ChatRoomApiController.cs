using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/ChatRooms")]
    public class ChatRoomApiController:ControllerBase
    {
        private readonly ChatRoomRepository _chatRoomRepository;

        public ChatRoomApiController(ChatRoomRepository chatRoomRepository)
        {
            _chatRoomRepository = chatRoomRepository;
        }

        //get ChatRooms All 
        [HttpGet("AllChatRooms")]
        public async Task<IActionResult> GetAllChatRooms(){
           var data=await _chatRoomRepository.GetChatRoomsWithBook();
          
 return Ok(data);
           
          

        
    }
   
    [HttpPost("ChatById")]
    public async Task<IActionResult> GetChatRoomById([FromBody] ChatRoomRequest chatRoomRequest ){
        if(!ModelState.IsValid){
            return BadRequest(new{message=ModelState});
        }
        // Validate input
    if (chatRoomRequest == null || string.IsNullOrEmpty(chatRoomRequest.selectedchatroomid))
    {
        return BadRequest(new { message = "Invalid request data" });
    }

    try
    {
        // Parse GUID
        if (!Guid.TryParse(chatRoomRequest.selectedchatroomid, out Guid chatRoomId))
        {
            return BadRequest(new { message = "Invalid chatroom ID format" });
        }

        // Get chatroom with navigation properties
        ChatRoom chatRoom = await _chatRoomRepository.GetByIdAsync(chatRoomId);
        
        if (chatRoom == null)
        {
            return NotFound(new { message = "ChatRoom not found" });
        }
       
        return Ok(chatRoom);            
    }
    catch(Exception error){
         return StatusCode(500, new { 
            success = false,
            message = "An error occurred while processing your request",
            error = error.Message // Only include in development environment
        });
    }

}
}
}