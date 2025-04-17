using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class BorrowedBook
    {
        [Key]
        public Guid BorrowedBookId{get;set;}
        [ForeignKey("BookId")]

        public Guid BookId{get;set;}
        public virtual Book book{get;set;}
        [ForeignKey("AccountId")]
        public Guid AccountId{get;set;}
        public virtual Account account{get;set;}
        public bool isDeleted{get;set;}
        public bool? isReturned{get;set;}
        public DateOnly DueDate{get;set;}
        public DateTime DateCreated{get;set;}

        
        

    }
}