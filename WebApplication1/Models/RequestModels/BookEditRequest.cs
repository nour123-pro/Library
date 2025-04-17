namespace WebApplication1.Controllers
{
    public class BookEditRequest
    {
        public string bookid{ get; set; }

        public string bookname{ get; set; }
        public string bookdescription{ get; set; }
        public string bookauthorid{ get; set; }
        public string categoryid{ get; set; }
        public string?  imageBase64{ get; set; }
    }
}