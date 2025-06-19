import {useEffect,useState} from 'react'
import axios from 'axios'
import Widget from '../ui/widget';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Cell } from "recharts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Product = {
  id: number;
  name: string;
  price: number;
  totalSold: number;
  seller: {
    name: string;
  };
};
type Seller = {
  id: string;
  name: string;
  email: string;
  updatedAt: string;
};

const DashboardHome = () => {
    const baseUrl = "http://localhost:3000";
    const [adminCount, setAdminCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [sellerCount,setSellerCount]=useState(0)
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [orderStatusCounts, setOrderStatusCounts] = useState({
      PENDING: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    });
    const [recentSellers, setRecentSellers] = useState<Seller[]>([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; total: number }[]>([]);

    const token = localStorage.getItem("token");
    console.log("Token:",token)
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

  useEffect(()=>{
    const fetchData=async()=>{
        try{
            const res=await axios.get(`${baseUrl}/api/stats/counts`,config)
            setAdminCount(res.data.adminCount)
            setUserCount(res.data.userCount)
            setSellerCount(res.data.sellerCount)

            const topProducts=await axios.get(`${baseUrl}/api/products/top-selling`)
            setTopProducts(topProducts.data)

            const orderStatus=await axios.get(`${baseUrl}/api/orders/status-counts`,config)
            setOrderStatusCounts(orderStatus.data.statusCounts)

            const recentSellersRes = await axios.get(`${baseUrl}/api/sellers/recent-approved`);
            setRecentSellers(recentSellersRes.data.sellers);

            const transactionsRes=await axios.get(`${baseUrl}/api/transactions`)
            const transactions=transactionsRes.data
            const revenueMap: { [month: string]: number } = {};
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            transactions.forEach((txn: any) => {
              const date = new Date(txn.createdAt);
              const month = monthNames[date.getMonth()];
              revenueMap[month] = (revenueMap[month] || 0) + txn.amount;
            });
            const monthly=monthNames.map(month=>({
              month,total:revenueMap[month] ||0
            }))
            setMonthlyRevenue(monthly);
            
        }
        catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }
    fetchData()
  },[])
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Widget label="Total Admins" value={adminCount} icon="admin" color="blue" />
        <Widget label="Total Sellers" value={sellerCount} icon="seller" color="green" />
        <Widget label="Total Users" value={userCount} icon="user" color="pink" />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
        <div className="rounded-lg border border-gray-200 shadow-sm">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader className="bg-gray-50 dark:bg-neutral-800">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs font-medium text-black uppercase">Product</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-black uppercase">Seller</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-black uppercase">Price</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-black uppercase">Total Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:bg-neutral-900 dark:divide-gray-700">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-neutral-900"
                        : "bg-gray-50 dark:bg-neutral-800"
                    }`}
                  >
                    <TableCell className="px-6 py-4 font-medium text-[#344E41] dark:text-white">{product.name}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {product.seller?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">₹{product.price}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.totalSold}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-400">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>


      <div>
    <h2 className="text-xl font-semibold mt-8 mb-2">Orders Status Summary</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Widget label="Pending" value={orderStatusCounts.PENDING} color="pink" showIcon={false} />
      <Widget label="Processing" value={orderStatusCounts.PROCESSING} color="blue" showIcon={false} />
      <Widget label="Shipped" value={orderStatusCounts.SHIPPED} color="green" showIcon={false} />
      <Widget label="Delivered" value={orderStatusCounts.DELIVERED} color="teal" showIcon={false} />
      <Widget label="Cancelled" value={orderStatusCounts.CANCELLED} color="dark" showIcon={false} />
    </div>
    </div>

      

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recently Approved Sellers</h2>
        <div className="rounded-lg border border-gray-200 shadow-sm">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader className="bg-[#75DDDD] dark:bg-neutral-800">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs font-medium text-black uppercase">Name</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-black uppercase">Email</TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-black uppercase">Approved On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:bg-neutral-900 dark:divide-gray-700">
              {recentSellers.length > 0 ? (
                recentSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell className="px-6 py-4 font-medium text-black dark:text-white">{seller.name}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{seller.email}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(seller.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-400">
                    No recently approved sellers
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>


      <div className="mt-10 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Revenue Analytics</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'black' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <YAxis 
            tickFormatter={(v) => `₹${v}`} 
            tick={{ fill: 'black' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <Tooltip 
            contentStyle={{
              background: '#172A3A',
              color: 'white',
              borderRadius: '8px',
              border: 'none'
            }}
            formatter={(value: number) => [`₹${value}`, "Revenue"]}
          />
          <Bar 
            dataKey="total" 
            fill="#004346" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          >
            {monthlyRevenue.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.total > 0 ? '#004346' : '#ccc'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    </div>
  )
}

export default DashboardHome