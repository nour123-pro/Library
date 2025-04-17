namespace WebApplication1.Models
{
    public class SignUpRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DateOfBirth { get; set; } // Keep it as string to avoid parsing issues
    public string Gender { get; set; }
}

}