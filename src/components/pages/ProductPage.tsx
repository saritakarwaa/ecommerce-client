
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: "PENDING" | "APPROVED" | "REJECTED"
  sellerId: string;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
};

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products"); 
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/api/products/${id}/approve`);
      fetchProducts();
    } catch (err) {
      console.error("Approve error", err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/admin/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-10 text-508991">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Product Management</h2>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product) => (
          <Card key={product.id}>
            <CardContent className="space-y-2">
              <div className="text-lg font-medium">{product.name}</div>
              <p>{product.description}</p>
              <p>₹{product.price} • Stock: {product.stock}</p>
              <p>Status: <span className="font-semibold">{product.status}</span></p>

               <p className="text-sm text-muted-foreground">
                    Seller ID: {product.seller?.id}
                    {product.seller?.name && ` • ${product.seller.name}`}
                </p>

              <div className="flex gap-2">
                {product.status === "PENDING" && (
                  <Button onClick={() => approveProduct(product.id)} variant="default">
                    Approve
                  </Button>
                )}
                <Button onClick={() => deleteProduct(product.id)} variant="destructive">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
