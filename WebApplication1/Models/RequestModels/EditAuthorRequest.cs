namespace WebApplication1.Models
{
    public class EditAuthorRequest
    {
        public string authorid{ get; set; }
        public string authorname{ get; set; }
        public string? ImageBase64{get;set;}
    }
}