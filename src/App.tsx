import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import './App.css'
import SidebarDemo from "@/components/sidebar-demo";
import DashboardHome from "./components/pages/DashboardHome";
import LoginCard from "./components/LoginCard";
import SignupCard from "./components/SignUpCard";

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginCard />} />
          <Route path="/register" element={<SignupCard />} />
          <Route
          path="/dashboard"
          element={
          <SidebarDemo>
              <DashboardHome />
          </SidebarDemo>
          }
        />
      </Routes>
    </Router>
    </div>
  )
}
export default App
