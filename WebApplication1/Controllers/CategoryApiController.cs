using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Localization;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/category")]
    public class CategoryApiController:ControllerBase
    {
        private readonly CategoryRepository _categoryRepository;

        public CategoryApiController(CategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet("AllCategories")]
        public async Task<IActionResult> GetAllCategories(){
            var result=await _categoryRepository.GetAllAysc();
            return Ok(result);
        }
        [HttpGet("BooksNumbersForEachCategory")]
        public async Task<IActionResult> GetNumbersForEachCategory(){
            var result = _categoryRepository.GetNumbers();
            return Ok(result);

        }
       
        
    }
}