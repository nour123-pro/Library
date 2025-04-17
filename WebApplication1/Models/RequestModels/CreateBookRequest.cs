namespace WebApplication1.Models
{
    public class CreateBookRequest
    {
         public string bookname{ get; set; }
        public string bookdescription{ get; set; }
        public string bookauthorid{ get; set; }
        public string categoryid{ get; set; }
        public string?  imageBase64{ get; set; }
    }
}