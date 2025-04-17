using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class ChatAccount
    {
        [Key]
        public Guid ChatAccountId{get;set;}
        [ForeignKey("ChatRoomId")]
        public Guid ChatRoomId{get;set;}
        public  virtual ChatRoom chatRoom{get;set;}
        [ForeignKey("AccountId")]
        public Guid AccountId{get;set;}
        public virtual Account account{get;set;}
        public DateTime DateCreated{get;set;}
        public bool isDeleted{get;set;}
    }
}