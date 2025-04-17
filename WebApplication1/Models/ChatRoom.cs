using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class ChatRoom
    {
        [Key]
        public Guid ChatRoomId{get;set;}
        public string ChatRoomName{get;set;}
        public byte[]? ChatRoomImage{get;set;}
        public string ChatRoomDescription{get;set;}
        public DateTime CreatedAt{get;set;}
        public bool IsDeleted{get;set;}
        [ForeignKey("BookId")]
        public Guid BookId{get;set;}
        public Book book{get;set;}
        
    }
}