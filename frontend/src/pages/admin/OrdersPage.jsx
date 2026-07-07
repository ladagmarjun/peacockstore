import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

function fmtPrice(n) { return '₱' + Number(n).toLocaleString('en-PH'); }

const STATUSES = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const BADGE = { pending: 'status-pending', processing: 'status-processing', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' };

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [error,  setError]  = useState('');
  const status = searchParams.get('status') || '';

  useEffect(() => {
    api.adminOrders(status)
      .then(setOrders)
      .catch(err => setError(err.message));
  }, [status]);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Orders</h1>
        <div className="filters">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`chip${status === s ? ' active' : ''}`}
              style={{ fontSize: 12 }}
              onClick={() => s ? setSearchParams({ status: s }) : setSearchParams({})}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Customer</th><th>Email</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={8} className="empty">No orders found.</td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customer_name}</td>
                <td>{o.customer_email}</td>
                <td>{fmtPrice(o.total_amount)}</td>
                <td>{o.payment_method?.replace('_', ' ')}</td>
                <td><span className={`status-badge ${BADGE[o.status] || ''}`}>{o.status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString('en-PH')}</td>
                <td><Link to={`/admin/orders/${o.id}`} className="tbl-link">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
