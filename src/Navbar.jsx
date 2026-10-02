```jsx
import React from "react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span>Ad</span>Spot
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search products..." />
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
      </div>

      <div className="nav-links">
        <span className="currency">RW RW</span>

        <button className="login-button">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
          <span>Login</span>
        </button>

        <button className="seller-button">
          Seller
        </button>

        <button className="cart-button">
          Cart
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
```
