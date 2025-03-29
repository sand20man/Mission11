import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookList from './components/BookList';
import { CartProvider } from './components/CartContext';
import CategorySelector from './components/CategorySelector';
import Cart from './pages/Cart';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App: React.FC = () => {
  // State for selected categories (filtering books based on category)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    // CartProvider to make the cart context accessible in all child components
    <CartProvider>
      <Router>
        <div className="container-fluid">
          {/* Navbar for navigation */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
              {/* Link to navigate to the home page */}
              <Link className="navbar-brand" to="/">
                Book Store
              </Link>
              {/* Toggler button for mobile responsiveness */}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              {/* Navbar items */}
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    {/* Link to the Home page */}
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    {/* Link to the Cart page */}
                    <Link className="nav-link" to="/cart">
                      Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container">
            {/* Routing to different pages */}
            <Routes>
              {/* Home route with carousel and book list */}
              <Route
                path="/"
                element={
                  <div>
                    {/* Carousel Section */}
                    <div
                      id="carouselExampleAutoplaying"
                      className="carousel slide"
                      data-bs-ride="carousel" // Auto slides
                    >
                      <div className="carousel-inner">
                        {/* Each carousel item represents a different image */}
                        <div className="carousel-item active">
                          {/* Featured Book 1 */}
                          <img
                            src="https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-157924db--Books11_1200x.jpg?v=1620061425"
                            className="d-block w-100"
                            alt="Featured Book 1"
                          />
                          <div className="carousel-caption d-none d-md-block">
                            <h5>Featured Book 1</h5>
                            <p>Discover the adventure of a lifetime.</p>
                          </div>
                        </div>
                        <div className="carousel-item">
                          {/* Featured Book 2 */}
                          <img
                            src="https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-b57dac15--Books8_1200x.jpg?v=1620061403"
                            className="d-block w-100"
                            alt="Featured Book 2"
                          />
                          <div className="carousel-caption d-none d-md-block">
                            <h5>Featured Book 2</h5>
                            <p>Unlock the secrets of the universe.</p>
                          </div>
                        </div>
                        <div className="carousel-item">
                          {/* Featured Book 3 */}
                          <img
                            src="https://cdn.shopify.com/s/files/1/0070/1884/0133/t/8/assets/pf-db636e27--Books23_1200x.jpg?v=1620061505"
                            className="d-block w-100"
                            alt="Featured Book 3"
                          />
                          <div className="carousel-caption d-none d-md-block">
                            <h5>Featured Book 3</h5>
                            <p>Embark on an epic journey.</p>
                          </div>
                        </div>
                      </div>
                      {/* Carousel control buttons */}
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>

                    {/* Book Categories and Book List Section */}
                    <div className="row mt-4">
                      {/* Category selector for filtering books */}
                      <div className="col-md-3">
                        <CategorySelector
                          onCategoryChange={setSelectedCategories} // Sets selected categories for filtering
                          selectedCategories={selectedCategories} // Pass selected categories
                        />
                      </div>
                      {/* Book list section displaying books based on selected categories */}
                      <div className="col-md-9">
                        <BookList selectedCategories={selectedCategories} />
                      </div>
                    </div>
                  </div>
                }
              />
              {/* Cart route */}
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
