import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();

  const deliveryFee = subtotal > 0 ? 3000 : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <section className="content-section empty-state">
        <h2>Your cart is empty</h2>
        <p>Browse the marketplace and add products to continue shopping.</p>
        <Link to="/products" className="primary-button inline-button">
          Explore products
        </Link>
      </section>
    );
  }

  return (
    <section className="content-section cart-page">
      <div className="section-header">
        <div>
          <span className="eyebrow accent">Your order</span>
          <h2>Shopping cart</h2>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <p>{item.price.toLocaleString()} RWF</p>
              </div>

              <div className="quantity-control">
                <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>

              <button type="button" className="text-button" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{subtotal.toLocaleString()} RWF</strong>
          </div>
          <div className="summary-line">
            <span>Delivery</span>
            <strong>{deliveryFee.toLocaleString()} RWF</strong>
          </div>
          <div className="summary-line total-line">
            <span>Total</span>
            <strong>{total.toLocaleString()} RWF</strong>
          </div>

          <Link to="/checkout" className="primary-button block-button">
            Proceed to checkout
          </Link>
          <Link to="/products" className="secondary-button block-button">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
