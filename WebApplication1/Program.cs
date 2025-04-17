using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Configure Identity (with int as primary key)
builder.Services.AddIdentity<User, IdentityRole<Guid>>() // ✅ Identity with int key
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders()
    .AddSignInManager<SignInManager<User>>()
    .AddUserManager<UserManager<User>>();    
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<BookRepository>();
builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<CommentRepository>();
builder.Services.AddScoped<BorrowedBookRepository>();
builder.Services.AddScoped<RatingRepository>();
builder.Services.AddScoped<FavorableCategoryRepository>();
builder.Services.AddScoped<ChatRoomRepository>();
builder.Services.AddScoped<ChatMessageRepository>();
builder.Services.AddScoped<ChatAccountRepository>();
builder.Services.AddScoped<AuthorRepository>();
builder.Services.AddControllersWithViews();
builder.Services.AddControllers();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseCors("AllowReactApp"); 
app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(app.Environment.WebRootPath, "Uploads", "ProfileImages")),
        RequestPath = "/Uploads/ProfileImages"
    });
app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
