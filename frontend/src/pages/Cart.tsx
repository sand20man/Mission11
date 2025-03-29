import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../components/CartContext';

const Cart: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    lastViewedPage,
  } = useCart();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    // If cart is empty or lastViewedPage is missing, go to home page
    if (cartItems.length === 0 || !lastViewedPage) {
      navigate('/');
    } else {
      navigate(lastViewedPage);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p className="lead">Add some books to get started!</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')} // Direct navigation to home page
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Shopping Cart</h2>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Book</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              const subtotal = item.book.price * item.quantity;

              return (
                <tr key={item.book.bookId}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <h5 className="mb-0">{item.book.title}</h5>
                        <small className="text-muted">
                          by {item.book.author}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>${item.book.price.toFixed(2)}</td>
                  <td>
                    <div className="input-group" style={{ maxWidth: '120px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(item.book.bookId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateQuantity(item.book.bookId, val);
                          }
                        }}
                        min="1"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(item.book.bookId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${subtotal.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.book.bookId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Total:
              </td>
              <td className="fw-bold">${total.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
          <button className="btn btn-outline-danger" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
        <Link to="/checkout" className="btn btn-success">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
