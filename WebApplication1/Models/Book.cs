using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Book
    {
        [Key]
        public Guid BookId{get;set;}
        public string BookName{get;set;}
        [ForeignKey("AuthorId")]
        public Guid AuthorId{get;set;}
        public virtual Author? Author{get;set;}
        [ForeignKey("CategoryId")]
        public Guid CategoryId{get;set;}
        public virtual Category? Category{get;set;}
        public byte[]? BookImages{get;set;}
        public string? BookDescription{get;set;}
         public DateTime DateCreated{get;set;}=DateTime.Now;
        public bool isDeleted { get; set; } = false;

    }
}