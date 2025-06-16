import { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../ui/usertable";
import UserForm from "../ui/userform";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get("/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchUsers();
  };

  const handleUpdate = async (updatedUser: any) => {
    await axios.put(`/api/users/${updatedUser.id}`, updatedUser, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setSelectedUser(null);
    fetchUsers();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      {selectedUser && (
        <UserForm user={selectedUser} onSubmit={handleUpdate} onCancel={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
