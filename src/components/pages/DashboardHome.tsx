import {useEffect,useState} from 'react'
import axios from 'axios'
import Widget from '../ui/widget';

type Product = {
  id: number;
  name: string;
  price: number;
  totalSold: number;
  seller: {
    name: string;
  };
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

   const token = localStorage.getItem("token");
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
        }
        catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }
    fetchData()
  },[])
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Widget label="Total Admins" value={adminCount} icon="admin" color="blue" />
        <Widget label="Total Sellers" value={sellerCount} icon="seller" color="green" />
        <Widget label="Total Users" value={userCount} icon="user" color="pink" />
      </div>

       <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sold</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-900 dark:divide-gray-700">
              {topProducts.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.seller?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">₹{product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.totalSold}</td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-sm text-gray-400">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
    <h2 className="text-xl font-semibold mt-8 mb-2">📦 Orders Status Summary</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Widget label="Pending" value={orderStatusCounts.PENDING} />
      <Widget label="Processing" value={orderStatusCounts.PROCESSING} />
      <Widget label="Shipped" value={orderStatusCounts.SHIPPED} />
      <Widget label="Delivered" value={orderStatusCounts.DELIVERED} />
      <Widget label="Cancelled" value={orderStatusCounts.CANCELLED} />
    </div>
    </div>
    </div>
  )
}

export default DashboardHome