import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="content-section empty-state">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="primary-button inline-button">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;
