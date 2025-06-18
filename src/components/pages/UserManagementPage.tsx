import { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../ui/usertable";
import UserForm from "../ui/userform";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type User = {
  id: string;
  name: string;
  email: string;
};

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
};

type Order = {
  id: string;
  createdAt: string;
  orderItems: OrderItem[];
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [orderUser, setOrderUser] = useState<User | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const baseUrl = "http://localhost:3000/api";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleViewOrders = async (user: User) => {
    try {
      const res = await axios.get(`${baseUrl}/orders/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrderUser(user);
      setSelectedOrders(res.data);
      setOrderDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch user orders", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleUpdate = async (updatedUser: User) => {
    try {
      await axios.put(`${baseUrl}/users/${updatedUser.id}`, updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>

      <UserTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewOrders={handleViewOrders}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={handleUpdate}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Orders for {orderUser?.name}</DialogTitle>
          </DialogHeader>

          {selectedOrders.length > 0 ? (
            <div className="space-y-4">
              {selectedOrders.map((order) => (
                <div
                  key={order.id}
                  className="border p-4 rounded bg-gray-50 shadow-sm"
                >
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 font-medium">Items:</p>
                  <ul className="list-disc list-inside ml-4">
                    {order.orderItems.map((item) => (
                      <li key={item.id}>
                        {item.productName} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
