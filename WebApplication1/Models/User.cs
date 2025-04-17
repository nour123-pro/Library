using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;

namespace WebApplication1.Models
{
    public class User:IdentityUser<Guid>
    {
         public required string FirstName{get;set;}
        public required string LastName{get;set;}
        public required DateOnly BirthDate{get;set;}
        public required Gender Gender{get;set;}
        public required DateTime DateCreated{get;set;}
        public bool isDeleted{get;set;}
        
    }
    public enum Gender{
          Female,
            Male
    }
}