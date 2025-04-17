namespace WebApplication1.Models
{
    public class BookAvailability
    {
        public Boolean IsAvailable{ get; set; }
        public DateOnly? NextAvailability{ get; set; }
    }
}