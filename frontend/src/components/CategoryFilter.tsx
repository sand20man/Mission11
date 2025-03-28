import { useEffect, useState } from 'react';
import './CategoryFilter.css';

function CategoryFilter({
  selectedType,
  setSelectedType,
}: {
  selectedType: string;
  setSelectedType: (type: string) => void;
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch books whenever selectedType changes
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/BookCollection?genre=${selectedType}`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedType]);

  return (
    <div className="category-filter">
      <h5>Book Type</h5>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="form-select mb-3"
      >
        <option value="All">All</option>
        <option value="Fiction">Fiction</option>
        <option value="Nonfiction">Nonfiction</option>
      </select>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryFilter;
