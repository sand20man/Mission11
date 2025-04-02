import { useEffect, useState } from 'react';
import { Book } from '../types/books';
import { deleteBook, fetchBooks } from '../api/Booksapi';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks('name', false, []);
        setBooks(data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to fetch books.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;
    try {
      await deleteBook(bookId);
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.bookId !== bookId)
      );
    } catch (error) {
      alert('Error deleting book. Please try again later.');
    }
  };

  if (loading) return <p className="text-center mt-4">Loading Books...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Admin Project Page</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {!showForm && (
          <button className="btn btn-success shadow-sm" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-circle"></i> Add New Book
          </button>
        )}

        <div className="d-flex align-items-center">
          <label className="me-2 fw-bold">Books per page:</label>
          <select
            value={booksPerPage}
            onChange={(e) => setBooksPerPage(Number(e.target.value))}
            className="form-select w-auto"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks('name', false, []).then((data) => setBooks(data.books));
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks('name', false, []).then((data) => setBooks(data.books));
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-primary">
            <tr className="text-center">
              <th>Book ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Classification</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.bookId} className="text-center align-middle">
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-warning btn-sm" onClick={() => setEditingBook(book)}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.bookId)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link shadow-sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link shadow-sm" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link shadow-sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminBooks;
