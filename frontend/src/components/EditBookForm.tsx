import { useState } from 'react';
import { Book } from '../types/books';
import { updateBook } from '../api/Booksapi';

interface EditBookFormProps {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState<Book>({ ...book });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'pageCount' || name === 'price' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook(formData.bookId, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow bg-white">
      <h2 className="text-center mb-3">Edit Book</h2>
      
      <div className="row g-2 mb-3">
        {['title', 'author', 'publisher', 'isbn', 'classification', 'category'].map((field) => (
          <div className="col-md-4" key={field}>
            <label className="form-label text-capitalize">{field}:</label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <label className="form-label">Page Count:</label>
          <input
            type="number"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
      </div>
      
      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-save"></i> Save Changes
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="bi bi-x-circle"></i> Cancel
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;
