import { useState } from "react";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="content-section auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className="auth-form">
          {!isLogin && (
            <>
              <label>
                Full name
                <input type="text" placeholder="Your name" />
              </label>
              <label>
                Account type
                <select defaultValue="customer">
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email
            <input type="email" placeholder="name@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>

          <button type="submit" className="primary-button block-button">
            {isLogin ? "Login to AdSpot" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AuthPage;
