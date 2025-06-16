// src/pages/dashboard/orders.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { StatusUpdater
    
 } from "../StatusUpdater";
type Order = {
  id: string;
  amount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  user: { name: string };
  seller: { name: string };
  orderItems: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

//   const token = localStorage.getItem("token");
//   const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>

      <input
        type="text"
        placeholder="Search by user name..."
        className="mb-4 px-4 py-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Seller</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.user.name}</td>
              <td className="px-4 py-2">{order.seller.name}</td>
              <td className="px-4 py-2">₹{order.amount}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">
                <StatusUpdater orderId={order.id} currentStatus={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
