using Microsoft.AspNetCore.Components.Forms;

namespace WebApplication1.Models
{
    public class EditAccountInfoRequest
    {

       
        public string oldusername{get;set;}
        public string newusername{get;set;}
        public string selectedcategoryid{get;set;}
       public string? ImageBase64{get;set;}
        
    }
}