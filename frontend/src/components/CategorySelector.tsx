import React, { useEffect, useState } from 'react';

interface CategorySelectorProps {
  onCategoryChange: (categories: string[]) => void;
  selectedCategories: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategoryChange,
  selectedCategories,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://localhost:5000/Book/GetBooksByCategory'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Error loading categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  if (loading) {
    return (
      <div className="card p-3 mb-4">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Categories</h4>
      </div>
      <div className="card-body">
        {categories.length === 0 ? (
          <p>No categories available</p>
        ) : (
          <div className="d-flex flex-column">
            {categories.map((category) => (
              <div className="form-check mb-2" key={category}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`category-${category}`}
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedCategories.length > 0 && (
        <div className="card-footer">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onCategoryChange([])}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
