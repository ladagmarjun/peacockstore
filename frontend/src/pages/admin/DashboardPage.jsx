import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

function fmtPrice(n) { return '₱' + Number(n).toLocaleString('en-PH'); }

const STATUS_COLORS = {
  pending: 'status-pending', processing: 'status-processing',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled',
};

export default function DashboardPage() {
  const [data,    setData]    = useState(null);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.adminDashboard()
      .then(setData)
      .catch(err => setError(err.message));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      {error && <div className="flash flash-error">{error}</div>}

      {data && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon">👜</div>
              <div className="stat-value">{data.stats.productCount}</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-value">{data.stats.orderCount}</div>
              <div className="stat-label">Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-value">{data.stats.userCount}</div>
              <div className="stat-label">Customers</div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-icon">💰</div>
              <div className="stat-value">{fmtPrice(data.stats.revenue)}</div>
              <div className="stat-label">Revenue</div>
            </div>
          </div>

          <div className="admin-section">
            <h2>Recent Orders</h2>
            <table className="admin-table">
              <thead>
                <tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {data.recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="empty">No orders yet.</td></tr>
                ) : data.recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer_name}</td>
                    <td>{fmtPrice(o.total_amount)}</td>
                    <td><span className={`status-badge ${STATUS_COLORS[o.status] || ''}`}>{o.status}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString('en-PH')}</td>
                    <td><Link to={`/admin/orders/${o.id}`} className="tbl-link">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
