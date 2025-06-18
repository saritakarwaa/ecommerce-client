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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Seller = {
  id: string;
  name: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

type PerformanceData = {
  metric: string;
  value: number;
};

export default function SellerManagement() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const baseUrl = "http://localhost:3000";

  const loadSellers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/sellers/`);
      setSellers(res.data);
    } catch (error) {
      console.error("Failed to fetch sellers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.patch(`${baseUrl}/${id}/approve`);
      loadSellers();
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seller?")) return;
    try {
      await axios.delete(`${baseUrl}/${id}`);
      loadSellers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const openPerformanceDialog = async (seller: Seller) => {
    setSelectedSeller(seller);
    try{
      const res=await axios.get(`${baseUrl}/api/sellers/${seller.id}/performance`)
      const data=res.data
      setPerformanceData([
        { metric: "Total Sales", value: `₹${data.totalSales}` },
        { metric: "Total Orders", value: data.totalOrders },
        { metric: "Returns", value: data.returns },
      ]);
    }
    catch(error){
       console.error("Failed to fetch performance data", error);
      setPerformanceData([
        { metric: "Error", value: 0},
      ]);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  if (loading) return <div className="p-4">Loading sellers...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Seller Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No sellers found.
              </TableCell>
            </TableRow>
          ) : (
            sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell>{seller.name}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.status}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        onClick={() => openPerformanceDialog(seller)}
                      >
                        View
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedSeller?.name}'s Performance
                        </DialogTitle>
                      </DialogHeader>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="metric" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#6366F1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {seller.status === "PENDING" && (
                      <button
                        onClick={() => handleApprove(seller.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(seller.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
