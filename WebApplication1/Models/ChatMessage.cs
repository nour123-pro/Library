using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class ChatMessage
    {
        [Key]
        public Guid ChatMessageId{get;set;}
        [ForeignKey("ChatAccountId")]
        public Guid ChatAccountId{get;set;}
        public virtual ChatAccount chatAccount{get;set;}
        public string content{get;set;}
        public DateTime CreatedAt{get;set;}
        public bool IsDeleted{get;set;}
        public byte[]? file{get;set;}
    }
}