import React, { useEffect, useMemo, useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

const API = "http://localhost:5000/api";

function AdminUsers() {
  const token = localStorage.getItem("hp:token");
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/admin/users`, { headers });
      const data = await res.json();
      console.log('Users loaded:', data);
      setList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const filtered = list.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
      u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  const setRole = (id, role) =>
    setList((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));

  const saveUser = async (u) => {
    try {
      setSaving(u._id);
      const res = await fetch(`${API}/admin/users/${u._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          email: u.email,
          gender: u.gender,
          role: u.role,
        }),
      });
      if (!res.ok) throw new Error();
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    } finally {
      setSaving(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/admin/users/${id}`, { method: "DELETE", headers });
      
      if (!res.ok) throw new Error('Failed to delete user');
      
      setList((p) => p.filter((x) => x._id !== id));
      alert('✅ User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('❌ Failed to delete user. Please try again.');
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600 text-lg">Manage user accounts, roles, and permissions</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          className="outline-none flex-1 text-lg"
          placeholder="Search users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Join Date</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role || "user"}
                      onChange={(e) => setRole(u._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${
                        u.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "2024-01-15"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveUser(u)}
                        disabled={saving === u._id}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 disabled:opacity-50"
                        title="Save"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(u._id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="px-6 py-10 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}
    </section>
  );
}

export default AdminUsers;