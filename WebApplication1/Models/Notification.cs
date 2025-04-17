using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Notification
    {
        [Key]
        public Guid NotificationId{get;set;}
        public string NotificationName{get;set;}
        public DateTime DateCreated{get;set;}
        public byte[]? NotificationImage{get;set;}
        public string? NotificationText{get;set;}
    }
}