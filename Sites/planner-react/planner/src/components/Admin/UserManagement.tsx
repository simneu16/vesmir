import React, { useState } from 'react';
import type { User } from '../../types';
import './UserManagement.css';

interface UserManagementProps {
  users: User[];
  currentUserId: number;
  onUpdateUser: (id: number, updates: { role?: string; veduci?: boolean }) => Promise<void>;
  onDeleteUser: (id: number) => Promise<void>;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUserId,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [tempRole, setTempRole] = useState<string>('');
  const [tempVeduci, setTempVeduci] = useState<boolean>(false);

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setTempRole(user.role || 'člen');
    setTempVeduci(user.veduci);
  };

  const handleSave = async (userId: number) => {
    try {
      await onUpdateUser(userId, { role: tempRole, veduci: tempVeduci });
      setEditingUser(null);
    } catch (error) {
      alert('Nepodarilo sa aktualizovať používateľa');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (userId === currentUserId) {
      alert('Nemôžete zmazať svoj vlastný účet!');
      return;
    }

    if (window.confirm(`Naozaj chcete zmazať používateľa "${userName}"?`)) {
      try {
        await onDeleteUser(userId);
      } catch (error) {
        alert('Nepodarilo sa zmazať používateľa');
      }
    }
  };

  return (
    <div className="user-management">
      <h2>Správa používateľov</h2>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Meno</th>
              <th>Nick</th>
              <th>Rola</th>
              <th>Vedúci</th>
              <th>Akcie</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.id === currentUserId ? 'current-user' : ''}>
                <td>{user.name}</td>
                <td>{user.nick}</td>
                <td>
                  {editingUser === user.id ? (
                    <select
                      value={tempRole}
                      onChange={(e) => setTempRole(e.target.value)}
                      className="role-select"
                    >
                      <option value="admin">admin</option>
                      <option value="člen">člen</option>
                    </select>
                  ) : (
                    <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'member'}`}>
                      {user.role || 'člen'}
                    </span>
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="checkbox"
                      checked={tempVeduci}
                      onChange={(e) => setTempVeduci(e.target.checked)}
                      className="veduci-checkbox"
                    />
                  ) : (
                    <span>{user.veduci ? '✅' : '❌'}</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingUser === user.id ? (
                      <>
                        <button
                          onClick={() => handleSave(user.id)}
                          className="btn-save"
                        >
                          💾 Uložiť
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn-cancel-edit"
                        >
                          ✖️ Zrušiť
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn-edit"
                        >
                          ✏️ Upraviť
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="btn-delete"
                          disabled={user.id === currentUserId}
                        >
                          🗑️ Zmazať
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};