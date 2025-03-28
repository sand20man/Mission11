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
        public IEnumerable<Book> GetBooks([FromQuery] string? sortBy = null, [FromQuery] bool descending = false,
                                          [FromQuery] string? genre = null, [FromQuery] string? author = null)
        {
            var books = _bookContext.Books.AsQueryable();

            // Apply genre filter if provided
            if (!string.IsNullOrEmpty(genre) && genre != "All")
            {
                books = books.Where(b => b.Classification.Contains(genre, StringComparison.OrdinalIgnoreCase));
            }

            // Apply author filter if provided
            if (!string.IsNullOrEmpty(author))
            {
                books = books.Where(b => b.Author.Contains(author, StringComparison.OrdinalIgnoreCase));
            }

            // Apply sorting if requested
            if (!string.IsNullOrEmpty(sortBy) && sortBy.ToLower() == "name")
            {
                books = descending ? books.OrderByDescending(b => b.Title) : books.OrderBy(b => b.Title);
            }

            return books.ToList();
        }

        [HttpGet("GetBookGenres")]
        public IActionResult GetBookGenres()
        {
            var bookGenres = _bookContext.Books
                .Select(p => p.Classification)
                .Distinct()
                .ToList();

            return Ok(bookGenres);
        }
    }
}
