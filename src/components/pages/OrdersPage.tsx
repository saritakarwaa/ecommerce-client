import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; 
import { StatusUpdater } from "../StatusUpdater";

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
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.seller.name}</TableCell>
                <TableCell>₹{order.amount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <StatusUpdater
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersPage;
