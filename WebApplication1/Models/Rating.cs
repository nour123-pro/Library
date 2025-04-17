using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace WebApplication1.Models
{
    public class Rating
    {
        [Key]
        public Guid RatingGuid{get;set;}
        [ForeignKey("BorrowedBookId")]
        public Guid BorrowedBookId{get;set;}
        public virtual BorrowedBook BorrowedBook{get;set;}
        public RatingValue RatingValue{get;set;}
        public DateTime CreatedAt{get;set;}
    }
    public enum RatingValue{ 
        Excellent=5,
        Good=3,
        VeryGood=4,
        Average=1,
        Bad=0
    }
}