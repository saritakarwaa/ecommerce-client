
import axios from "axios";
import { useState } from "react";

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export const StatusUpdater = ({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      //const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/orders/${orderId}/status`,
        { status: newStatus }
        //{ headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="px-2 py-1 border rounded"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
};
