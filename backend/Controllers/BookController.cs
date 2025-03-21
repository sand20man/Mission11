using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;
using System.Linq;

namespace Mission11.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BooksDbContext _bookContext;
        public BookController(BooksDbContext temp) => _bookContext = temp;

        [HttpGet("BookCollection")]
        public IEnumerable<Book> GetBooks([FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {
            var books = _bookContext.Books.AsQueryable();

            // Apply sorting if requested
            if (!string.IsNullOrEmpty(sortBy) && sortBy.ToLower() == "name")
            {
                books = descending ? books.OrderByDescending(b => b.Title) : books.OrderBy(b => b.Title);
            }

            return books.ToList();
        }
    }
}