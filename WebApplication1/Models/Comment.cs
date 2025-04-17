using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Comment
    {
        [Key]
        public Guid CommentId{get;set;}
        [ForeignKey("BorrowedBookId")]
        public Guid? BorrowedBookId{get;set;}
        public virtual BorrowedBook borrowedBook{get;set;}
        public string CommentContent{get;set;}
        public DateTime CreatedAt{get;set;}
        public bool IsDeleted{get;set;}
        


    }
}