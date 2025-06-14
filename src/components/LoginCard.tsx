import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AuthForm from "./ui/AuthForm";
import { BorderBeam } from "./border-beam";
import { useNavigate } from "react-router-dom";


export default function LoginCard() {
  const baseUrl = "http://localhost:3000";
  const navigate=useNavigate()

  const handleLogin = async (data: Record<string, string>) => {
    console.log("Login payload:", data);
    try{
      const response=await fetch(`${baseUrl}/api/admins/login`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })
      const result=await response.json()
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId",result.id)
        localStorage.setItem("role", result.role); 
        console.log("Login successful", result);
         navigate("/dashboard")
      }
      else{
        alert(result.error)
      }
    }
    catch (err: any) {
      alert(err.message || "An error occurred during login.");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-neutral-900 p-4">
    <Card className="relative w-[350px] overflow-hidden p-4 shadow-xl">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm type="login" onSubmit={handleLogin} />
      </CardContent>
       <div className="absolute inset-0 pointer-events-none">
          <BorderBeam duration={8} size={100} />
        </div>
    </Card>
    </div>
  );
}