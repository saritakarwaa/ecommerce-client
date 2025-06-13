import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react"
import axios from "axios";

type Product={
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  status: string;
  sellerId: string;
  createdAt: string;
}

const SellerProducts:React.FC=()=>{
    const [products,setProducts]=useState<Product[]>([])
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        const fetchProducts=async()=>{
            const sellerId = "e393740d-d779-4818-9459-9e502ef2e64b";
            try{
                const response=await axios.get(``)
                setProducts(response.data);
            }
            catch(error){
                console.error("Error fetching seller products:", error);
            }
            finally{
                setLoading(false)
            }
        }
        fetchProducts()
    },[])

    if (loading) return <p className="p-4">Loading seller products...</p>;

    return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Seller Products</h2>
      <div className="overflow-auto border border-gray-300 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Stock</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 text-sm">{product.id.slice(0, 6)}...</td>
                <td className="px-4 py-2 text-sm">{product.name}</td>
                <td className="px-4 py-2 text-sm">{product.stock}</td>
                <td className="px-4 py-2 text-sm">₹{product.price.toLocaleString()}</td>
                <td className="px-4 py-2 text-sm">
                  <Switch
                    checked={product.status === "APPROVED"}
                    className={`${product.status === "APPROVED" ? "bg-green-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                    disabled
                  >
                    <span className="sr-only">Toggle status</span>
                    <span
                      className={`${
                        product.status === "APPROVED" ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </td>
                <td className="px-4 py-2 text-sm">{new Date(product.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
}

export default SellerProducts