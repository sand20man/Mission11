using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;
using System.Collections.Generic;
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
        public IActionResult GetBooks([FromQuery] string? sortBy = "title", [FromQuery] bool descending = false, [FromQuery] List<string>? category = null)
        {
            var query = _bookContext.Books.AsQueryable();

            // Apply category filtering if provided
            if (category != null && category.Any())
            {
                query = query.Where(b => category.Contains(b.Category));
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                // Case insensitive comparison for property name
                switch (sortBy.ToLower())
                {
                    case "name":
                    case "title":
                        query = descending
                            ? query.OrderByDescending(b => b.Title)
                            : query.OrderBy(b => b.Title);
                        break;
                    case "author":
                        query = descending
                            ? query.OrderByDescending(b => b.Author)
                            : query.OrderBy(b => b.Author);
                        break;
                    case "price":
                        query = descending
                            ? query.OrderByDescending(b => b.Price)
                            : query.OrderBy(b => b.Price);
                        break;
                    default:
                        query = descending
                            ? query.OrderByDescending(b => b.Title)
                            : query.OrderBy(b => b.Title);
                        break;
                }
            }

            var books = query.ToList();

            return Ok(new { books });
        }

        [HttpGet("GetBooksByCategory")]
        public IActionResult GetBooksByCategory()
        {
            var categories = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newbook)
        {
            _bookContext.Books.Add(newbook);
            _bookContext.SaveChanges();
            return Ok(newbook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;


            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}