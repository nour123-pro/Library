using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ChatMessageRepository : GenericRepository<ChatMessage>
    {
        public ChatMessageRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<ChatMessage>> ChatMessagesForChatRoomAsync(Guid chatroomid)
{
    return await _context.ChatMessages
        .Include(cm => cm.chatAccount)           // Include ChatAccount
            .ThenInclude(ca => ca.account)       // Then include Account
        .Where(cm => cm.chatAccount.ChatRoomId == chatroomid && !cm.IsDeleted)
        .OrderBy(cm => cm.CreatedAt)
        .ToListAsync();
}

public async Task<ChatAccount> CheckAccountEnrolledIn(Guid accountId, Guid chatRoomId)
{
    // Assuming _context is your DbContext
    var chatAccount = await _context.ChatAccounts
        .FirstOrDefaultAsync(ca => ca.AccountId == accountId && ca.ChatRoomId == chatRoomId && ca.isDeleted == false);

    // If the account is found and not deleted, return the chat account
    if (chatAccount != null)
    {
        return chatAccount;
    }

    // If no such chat account exists, return null or throw an exception based on your requirements
    return null;
}



}
    }
