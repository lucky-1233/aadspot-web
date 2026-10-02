const stores = [
  {
    id: 1,
    name: "Urban Style Rwanda",
    category: "Fashion",
    description: "Modern apparel and stylish essentials for everyday wear.",
    location: "Kigali",
    contact: "+250 788 123 456",
  },
  {
    id: 2,
    name: "TechHub Rwanda",
    category: "Electronics",
    description: "Smart phones, audio gear, and digital accessories.",
    location: "Kigali",
    contact: "+250 788 654 321",
  },
  {
    id: 3,
    name: "SportWorld",
    category: "Sports",
    description: "Performance gear and sports essentials for active lifestyles.",
    location: "Huye",
    contact: "+250 783 224 110",
  },
];

function StoresPage() {
  return (
    <section className="content-section">
      <div className="section-header">
        <div>
          <span className="eyebrow accent">Trusted sellers</span>
          <h2>Popular stores</h2>
        </div>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <article key={store.id} className="store-card">
            <div className="store-logo">{store.name.charAt(0)}</div>
            <h3>{store.name}</h3>
            <span className="store-tag">{store.category}</span>
            <p>{store.description}</p>
            <ul>
              <li>Location: {store.location}</li>
              <li>Contact: {store.contact}</li>
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StoresPage;
