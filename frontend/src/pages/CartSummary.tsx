import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';

const CartSummary: React.FC = () => {
  const { itemCount, total } = useCart();

  return (
    <div className="card mb-4 bg-light">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-0">Your Cart</h5>
          <p className="card-text mb-0">
            {itemCount === 0 ? (
              <>
                <i className="bi bi-cart-x me-2" /> Your cart is empty
              </>
            ) : (
              `${itemCount} item${itemCount !== 1 ? 's' : ''} ($${total.toFixed(2)})`
            )}
          </p>
        </div>
        <Link to="/cart" className="btn btn-primary">
          View Cart
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
