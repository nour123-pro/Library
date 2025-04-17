using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Category
    {
        [Key]
        public Guid CategoryId{get;set;}
        public string CategoryName{get;set;}
        public bool isDeleted{get;set;}
        public DateTime CreatedAt{get;set;}
    }
}