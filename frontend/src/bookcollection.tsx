import { useEffect, useState } from 'react';
import { Book } from './types/books';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [sortDescending, setSortDescending] = useState(false); // Track sort state

  // Function to fetch books with sorting
  const fetchBooks = async (sortBy = 'name', descending = false) => {
    try {
      const response = await fetch(
        `https://localhost:5000/Book/BookCollection?sortBy=${sortBy}&descending=${descending}`
      );
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (currentPage > Math.ceil(books.length / booksPerPage)) {
      setCurrentPage(1);
    }
  }, [books, booksPerPage, currentPage]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Toggle sort order and fetch books again
  const handleSort = () => {
    setSortDescending((prev) => !prev);
    fetchBooks('name', !sortDescending);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📚 Book Collection</h1>

      <div className="mb-3 text-center">
        <label className="me-2 fw-bold">Books per page:</label>
        <select
          value={booksPerPage}
          onChange={(e) => setBooksPerPage(Number(e.target.value))}
          className="form-select w-auto d-inline-block"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {/* Sort Button */}
      <div className="text-center mb-3">
        <button className="btn btn-primary" onClick={handleSort}>
          Sort by Name {sortDescending ? '🔽' : '🔼'}
        </button>
      </div>

      {currentBooks.length === 0 ? (
        <p className="text-center text-danger">
          No books available for this page.
        </p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {currentBooks.map((book) => (
            <div key={book.bookId} className="col-md-6 col-lg-4 d-flex">
              <div
                className="card w-100 shadow-sm border-0"
                style={{ minWidth: '250px' }}
              >
                <div className="card-body d-flex flex-column">
                  <h4 className="card-title text-primary text-wrap">
                    {book.title}
                  </h4>
                  <p className="text-muted mb-2">
                    by <strong>{book.author}</strong>
                  </p>
                  <ul
                    className="list-group list-group-flush w-100"
                    style={{ display: 'block' }}
                  >
                    <li className="list-group-item">
                      <strong>Publisher:</strong> {book.publisher}
                    </li>
                    <li className="list-group-item">
                      <strong>ISBN:</strong> {book.isbn}
                    </li>
                    <li className="list-group-item">
                      <strong>Classification:</strong> {book.classification}
                    </li>
                    <li className="list-group-item">
                      <strong>Category:</strong> {book.category}
                    </li>
                    <li className="list-group-item">
                      <strong>Pages:</strong> {book.pageCount}
                    </li>
                    <li className="list-group-item">
                      <strong>Price:</strong> ${book.price}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from(
            { length: Math.max(1, Math.ceil(books.length / booksPerPage)) },
            (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
              >
                <button
                  onClick={() => paginate(i + 1)}
                  className="page-link border-0 shadow-sm"
                  style={{ cursor: 'pointer' }}
                >
                  {i + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default BookList;
