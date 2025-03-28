import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/BookList';
import WelcomeBand from '../components/WelcomeBand';

function BookPage() {
  const [selectedType, setSelectedType] = useState<string>('All');

  return (
    <div className="container mt-4">
      <WelcomeBand />
      <div className="row">
        <div className="col-md-3">
          <CategoryFilter selectedType={selectedType} setSelectedType={setSelectedType} />
        </div>
        <div className="col-md-9">
          <BookList selectedType={selectedType} />
        </div>
      </div>
    </div>
  );
}

export default BookPage;
