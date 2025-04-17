using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using Microsoft.VisualBasic;

namespace WebApplication1.Models
{
    public class Account
    {
        

        [Key]
        public Guid AccountId{get;set;}
        [ForeignKey("UserId")]
        public Guid UserId{get;set;}
        public virtual User user{get;set;}
        public string AccountName{get;set;}
        public DateTime DateCreated{get;set;}
        public bool isDeleted{get;set;}
        public byte[]? AccountProfileImage{get;set;}
        public string? AccountProfileImageUrl{get;set;}
        
        
    }
}