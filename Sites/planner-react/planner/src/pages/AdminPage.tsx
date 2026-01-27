import React from 'react';
import { UserManagement } from '../components/Admin/UserManagement';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';

export const AdminPage: React.FC = () => {
  const { users, loading, error, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();

  if (loading) {
    return (
      <div className="admin-page">
        <h1>⚙️ Admin zóna</h1>
        <div className="admin-content">
          <p>Načítavam používateľov...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h1>⚙️ Admin zóna</h1>
        <div className="admin-content">
          <p style={{ color: '#dc2626' }}>Chyba: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>⚙️ Admin zóna</h1>
      <UserManagement
        users={users}
        currentUserId={currentUser?.id || 0}
        onUpdateUser={updateUser}
        onDeleteUser={deleteUser}
      />
    </div>
  );
};