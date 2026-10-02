function ProfilePage() {
  return (
    <section className="content-section profile-page">
      <div className="section-header">
        <div>
          <span className="eyebrow accent">Account</span>
          <h2>My profile</h2>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Personal information</h3>
          <p>Name: Jane Mutoni</p>
          <p>Email: jane@example.com</p>
          <p>Phone: +250 788 000 111</p>
        </div>

        <div className="profile-card">
          <h3>Saved addresses</h3>
          <p>Kigali, Rwanda</p>
          <p>Gasabo District</p>
        </div>

        <div className="profile-card">
          <h3>Favorites</h3>
          <p>3 saved products</p>
        </div>

        <div className="profile-card">
          <h3>Account settings</h3>
          <p>Notifications enabled</p>
          <p>Language: English</p>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
