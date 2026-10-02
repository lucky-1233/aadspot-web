import { Link } from "react-router-dom";

function CheckoutPage() {
  return (
    <section className="content-section checkout-page">
      <div className="section-header">
        <div>
          <span className="eyebrow accent">Checkout</span>
          <h2>Complete your order</h2>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form">
          <label>
            Full name
            <input type="text" placeholder="Your full name" />
          </label>
          <label>
            Phone number
            <input type="tel" placeholder="+250 788 000 000" />
          </label>
          <label>
            District
            <input type="text" placeholder="Kigali" />
          </label>
          <label>
            Delivery address
            <textarea rows="4" placeholder="Street, sector, house details" />
          </label>

          <button type="submit" className="primary-button block-button">
            Place order
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Order summary</h3>
          <div className="summary-line">
            <span>1 x Nike Air Max</span>
            <strong>85,000 RWF</strong>
          </div>
          <div className="summary-line">
            <span>Delivery</span>
            <strong>3,000 RWF</strong>
          </div>
          <div className="summary-line total-line">
            <span>Total</span>
            <strong>88,000 RWF</strong>
          </div>
          <Link to="/cart" className="secondary-button block-button">
            Back to cart
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
