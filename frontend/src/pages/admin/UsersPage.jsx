import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

export default function UsersPage() {
  const [users,  setUsers]  = useState([]);
  const [msg,    setMsg]    = useState('');
  const [error,  setError]  = useState('');

  useEffect(() => {
    api.adminUsers().then(setUsers).catch(err => setError(err.message));
  }, []);

  const update = async (id, body) => {
    try {
      await api.adminUpdateUser(id, body);
      setMsg('User updated.');
      const updated = await api.adminUsers();
      setUsers(updated);
    } catch (err) { setError(err.message); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Users</h1>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Active</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={8} className="empty">No users yet.</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td>
                  <select
                    defaultValue={u.role}
                    onChange={e => update(u.id, { role: e.target.value, is_active: u.is_active })}
                    style={{ padding: '4px 8px', fontSize: 12, border: '1px solid var(--line)', borderRadius: 6 }}
                  >
                    <option value="customer">customer</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>{u.is_active ? '✅' : '❌'}</td>
                <td>{new Date(u.created_at).toLocaleDateString('en-PH')}</td>
                <td>
                  <button
                    className="tbl-link"
                    onClick={() => update(u.id, { role: u.role, is_active: !u.is_active })}
                  >
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
