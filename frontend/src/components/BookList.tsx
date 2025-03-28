import { useEffect, useState } from 'react';
import { Book } from '../types/books';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookList = ({ selectedType }: { selectedType: string }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [sortDescending, setSortDescending] = useState(false);

  // Fetch books with filtering by type
  const fetchBooks = async (sortBy = 'name', descending = false, type: string) => {
    try {
      const typeParam = type !== 'All' ? `type=${encodeURIComponent(type)}` : '';

      const response = await fetch(
        `https://localhost:5000/Book/BookCollection?${typeParam}&sortBy=${sortBy}&descending=${descending}`
      );

      if (!response.ok) throw new Error('Failed to fetch books');

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Re-fetch books when type changes
  useEffect(() => {
    fetchBooks('name', sortDescending, selectedType);
  }, [selectedType, sortDescending]);

  // Reset to page 1 when books update
  useEffect(() => {
    if (currentPage > Math.ceil(books.length / booksPerPage)) {
      setCurrentPage(1);
    }
  }, [books, booksPerPage]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📚 Book Collection</h1>

      {currentBooks.length === 0 ? (
        <p className="text-center text-danger">No books available.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {currentBooks.map((book) => (
            <div key={book.bookId} className="col-md-6 col-lg-4 d-flex">
              <div className="card w-100 shadow-sm border-0" style={{ minWidth: '250px' }}>
                <div className="card-body d-flex flex-column">
                  <h4 className="card-title text-primary text-wrap">{book.title}</h4>
                  <p className="text-muted mb-2">
                    by <strong>{book.author}</strong>
                  </p>
                  <ul className="list-group list-group-flush w-100">
                    <li className="list-group-item"><strong>Publisher:</strong> {book.publisher}</li>
                    <li className="list-group-item"><strong>ISBN:</strong> {book.isbn}</li>
                    <li className="list-group-item"><strong>Genre:</strong> {book.classification}</li>
                    <li className="list-group-item"><strong>Pages:</strong> {book.pageCount}</li>
                    <li className="list-group-item"><strong>Price:</strong> ${book.price}</li>
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
          {Array.from({ length: Math.max(1, Math.ceil(books.length / booksPerPage)) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button onClick={() => setCurrentPage(i + 1)} className="page-link border-0 shadow-sm">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default BookList;
