import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import './App.css'
import SidebarDemo from "@/components/sidebar-demo";
import DashboardHome from "./components/pages/DashboardHome";
import LoginCard from "./components/LoginCard";
import SignupCard from "./components/SignUpCard";
import OrdersPage from "./components/pages/OrdersPage";
import UserManagementPage from "./components/pages/UserManagementPage";
import ProductManagementPage from "./components/pages/ProductPage";


function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginCard />} />
          <Route path="/register" element={<SignupCard />} />

         <Route path="/dashboard" element={<SidebarDemo />}>
          <Route index element={<DashboardHome />} /> 
          <Route path="orders" element={<OrdersPage />} /> 
          <Route path="users" element={<UserManagementPage />} /> 
          <Route path="products" element={<ProductManagementPage/>} />
        </Route>

      </Routes>
    </Router>
    </div>
  )
}
export default App
