const orders = [
  {
    id: "AD-1001",
    date: "2026-09-10",
    total: 132000,
    status: "Delivered",
    payment: "Paid",
  },
  {
    id: "AD-1002",
    date: "2026-09-18",
    total: 54000,
    status: "Processing",
    payment: "Paid",
  },
];

function OrdersPage() {
  return (
    <section className="content-section">
      <div className="section-header">
        <div>
          <span className="eyebrow accent">Orders</span>
          <h2>My order history</h2>
        </div>
      </div>

      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.total.toLocaleString()} RWF</td>
                <td>{order.payment}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OrdersPage;
