import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import './App.css'
import SidebarDemo from "@/components/sidebar-demo";
import SellerProducts from "./components/seller/SellerProducts";
import LoginCard from "./components/LoginCard";

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginCard />} />
          <Route
          path="/seller"
          element={
            <SidebarDemo>
              <SellerProducts />
            </SidebarDemo>
          }
        />
      </Routes>
    </Router>
    </div>
  )
}

export default App
