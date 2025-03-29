import './App.css';
import BookCollection from './BookList';
import CategoryFilter from './CategoryFilter';
import WelcomeBand from './WelcomeBand';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <>
      <div className="container">
        <div className="row bg-primary text-white text-center py-3">
          <WelcomeBand />
        </div>
        <div className="row">
          <div className="col-md-3">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="col-md-9">
            <BookCollection selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
