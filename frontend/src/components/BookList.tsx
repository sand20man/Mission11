import { useEffect, useState, useRef } from 'react';
import { useCart } from './CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Toast } from 'bootstrap';
import { Book } from '../types/books';
import CartSummary from '../pages/CartSummary';

// I ADDED TOAST NOTIFICATIONS THROUGH BOOTSTRAP
// I ALSO ADDED A BOOK CAROUSEL

const BookList = ({ selectedCategories }: { selectedCategories: string[] }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [sortDescending, setSortDescending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>(
    {}
  );
  const { addToCart, setLastViewedPage } = useCart();
  const toastRef = useRef<HTMLDivElement>(null);

  const fetchBooks = async (sortBy = 'name', descending = false) => {
    setLoading(true);
    try {
      const categoryParams = selectedCategories
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/Book/BookCollection?sortBy=${sortBy}&descending=${descending}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
      setBooks(data.books);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks('name', sortDescending);
  }, [sortDescending, booksPerPage, selectedCategories]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSort = () => setSortDescending((prev) => !prev);

  const handleAddToCart = async (book: Book) => {
    setAddingToCart((prev) => ({ ...prev, [book.bookId]: true }));

    try {
      addToCart(book);
      setLastViewedPage(
        `/books?page=${currentPage}&sort=${sortDescending ? 'desc' : 'asc'}&categories=${selectedCategories.join(',')}`
      );
      showToast(book.title);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [book.bookId]: false }));
    }
  };

  const showToast = (bookTitle: string) => {
    if (toastRef.current) {
      toastRef.current.querySelector('.toast-body')!.textContent =
        `"${bookTitle}" added to cart!`;

      // Create a Bootstrap Toast instance
      const toast = new Toast(toastRef.current);
      toast.show();
    }
  };

  return (
    <div className="container mt-4">
      <CartSummary />

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

      <div className="text-center mb-3">
        <button className="btn btn-primary" onClick={handleSort}>
          Sort by Name {sortDescending ? '🔽' : '🔼'}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : currentBooks.length === 0 ? (
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
                  <ul className="list-group list-group-flush w-100">
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
                  <div className="mt-auto pt-3">
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleAddToCart(book)}
                      disabled={addingToCart[book.bookId]}
                    >
                      {addingToCart[book.bookId] ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                >
                  {i + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Bootstrap Toast Notification */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      >
        <div
          ref={toastRef}
          className="toast align-items-center text-white bg-success border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body"></div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
