import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light m-0 p-0">
        <div className="text-center p-5 bg-white rounded shadow w-50">
          <i className="bi bi-cart-x" style={{ fontSize: '6rem', color: '#6c757d' }}></i>
          <h1 className="mt-4 display-4">Your Cart is Empty</h1>
          <p className="lead text-muted mb-4 fs-4">Add some books to your cart and discover amazing reads!</p>
          <button
            className="btn btn-primary btn-lg px-5 py-3 fs-5"
            onClick={() => navigate('/')}
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vw-100 vh-100 d-flex flex-column m-0 p-0 overflow-hidden bg-light">
      {/* Header */}
      <div className="p-4 bg-dark text-white">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">Shopping Cart</h1>
            <span className="badge bg-primary rounded-pill fs-5 px-3 py-2">{cartItems.length} items</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container-fluid flex-grow-1 d-flex py-4 overflow-hidden">
        <div className="row w-100 mx-0">
          {/* Cart Items - 70% width on large screens */}
          <div className="col-lg-8 d-flex flex-column overflow-hidden px-4">
            <div className="card shadow h-100 d-flex flex-column">
              <div className="card-body p-0 overflow-auto flex-grow-1">
                <table className="table table-hover mb-0 fs-5">
                  <thead className="sticky-top bg-white">
                    <tr>
                      <th className="ps-4 py-3" style={{ width: '50%' }}>Book</th>
                      <th className="py-3" style={{ width: '15%' }}>Price</th>
                      <th className="py-3" style={{ width: '15%' }}>Quantity</th>
                      <th className="py-3" style={{ width: '15%' }}>Subtotal</th>
                      <th className="text-end pe-4 py-3" style={{ width: '5%' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      const subtotal = item.book.price * item.quantity;

                      return (
                        <tr key={item.book.bookId}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center py-4">
                              <div className="bg-secondary bg-opacity-10 rounded me-3" style={{ width: '80px', height: '120px' }}>
                                <div className="ratio ratio-1x1 bg-secondary opacity-25 rounded"></div>
                              </div>
                              <div>
                                <h4 className="mb-2">{item.book.title}</h4>
                                <p className="text-muted mb-0 fs-5">by {item.book.author}</p>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle fw-bold fs-5">${item.book.price.toFixed(2)}</td>
                          <td className="align-middle">
                            <div className="input-group" style={{ maxWidth: '150px' }}>
                              <button
                                className="btn btn-outline-secondary fs-5 px-3"
                                onClick={() =>
                                  updateQuantity(item.book.bookId, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                className="form-control text-center fs-5"
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
                                className="btn btn-outline-secondary fs-5 px-3"
                                onClick={() =>
                                  updateQuantity(item.book.bookId, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="align-middle fw-bold fs-5">${subtotal.toFixed(2)}</td>
                          <td className="align-middle text-end pe-4">
                            <button
                              className="btn btn-outline-danger px-3 py-2"
                              onClick={() => removeFromCart(item.book.bookId)}
                            >
                              <i className="bi bi-trash me-2"></i>
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="card-footer bg-white p-3 d-flex gap-2">
                <button
                  className="btn btn-primary py-2 px-4 fs-5"
                  onClick={handleContinueShopping}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Continue Shopping
                </button>
                <button className="btn btn-outline-danger py-2 px-4 fs-5" onClick={clearCart}>
                  <i className="bi bi-x-circle me-2"></i>
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary - 30% width on large screens */}
          <div className="col-lg-4 d-flex flex-column px-4">
            <div className="card shadow mb-4">
              <div className="card-header bg-white p-4">
                <h3 className="mb-0">Order Summary</h3>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-3 fs-5">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 fs-5">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-3 fs-5">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <hr className="my-4" />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-4">Total</span>
                  <span className="fw-bold fs-4">${(total + (total * 0.08)).toFixed(2)}</span>
                </div>
                <button className="btn btn-success w-100 py-3 fs-5 fw-bold">
                  Proceed to Checkout
                </button>
              </div>
            </div>
            
            <div className="card shadow mb-4">
              <div className="card-body p-4">
                <h4 className="card-title mb-3">Have a promo code?</h4>
                <div className="input-group mb-3">
                  <input type="text" className="form-control fs-5 py-2" placeholder="Enter code" />
                  <button className="btn btn-outline-secondary fs-5 px-4" type="button">Apply</button>
                </div>
              </div>
            </div>
            
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="card-title mb-3">Estimated Delivery</h4>
                <p className="fs-5 mb-2">Standard: 3-5 business days</p>
                <p className="fs-5 mb-0">Express: 1-2 business days (+$12.99)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;