using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class  FavorableCategory
    {
        [Key]
        public Guid  FavorableCategoryId{get;set;}
        [ForeignKey("CategoryId")]
        public Guid CategoryId{get;set;}
        public Category category{get;set;}
        [ForeignKey("AccountId")]
        public Guid AccountId{get;set;}
        public Account account{get;set;}

    }
}