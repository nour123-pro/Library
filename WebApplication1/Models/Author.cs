using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Author
    {
        [Key]
        public Guid AuthorId{get;set;}
        public string AuthorName{get;set;}
        public byte[]? AuthorImage{get;set;}
        public DateTime CreatedAt{get;set;}
        public bool isDeleted{get;set;}
    }
}