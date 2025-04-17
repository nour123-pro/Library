using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ChatRoomRepository : GenericRepository<ChatRoom>
    {
        public ChatRoomRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        //getting chatroom with its book
        public async Task<IEnumerable<ChatRoom>> GetChatRoomsWithBook(){
               return await _context.ChatRooms.Include(chatroom=>chatroom.book).ToListAsync();
         
         
        }
       
    }
}