using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class ChatAccountRepository : GenericRepository<ChatAccount>
    {
        public ChatAccountRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
        //enroll in chatroom for an ChatAccount
       public async Task<ChatAccount> GetChatAccountByChatRoomAndAccountIdAsync(Guid chatRoomId, Guid accountId)
    {
       
        return await _context.ChatAccounts
            .Where(ca => ca.ChatRoomId == chatRoomId && ca.AccountId == accountId)
            .FirstOrDefaultAsync(); 
    }
    
    //get SubscibersInChatRoom
  public async Task<IEnumerable<Account>> GetSubscribersForChatRoom(Guid chatroomid)
{
    var chatAccounts = await _context.ChatAccounts
        .Where(ca => ca.ChatRoomId == chatroomid)
        .Include(ca => ca.account)
        .ToListAsync();

    
    var accounts = chatAccounts.Select(ca => ca.account).ToList();

    return accounts;
}
//get number of chatroom for each account
public async Task<int> GetNumberChatRoomsForAccount(string accountname){
            var count = _context.ChatAccounts.Count(a => a.account.AccountName == accountname);
            return count>0? count : 0;
        }

    }
}