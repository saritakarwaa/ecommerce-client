import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import AuthForm from "./ui/AuthForm";

export default function SignupCard() {
    const baseUrl = "http://localhost:5000";
  const handleSignup = async (data: Record<string, string>) => {
    console.log("Signup payload:", data);
    try{
        const response = await fetch(`${baseUrl}/api/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        console.log("Login successful", result);
       
      } else {
        alert(result.error);
      }

    }
    catch (err: any) {
      alert(err.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <Card className="w-[350px] p-6 shadow-lg">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="signup" onSubmit={handleSignup} />
        </CardContent>
      </Card>
    </div>
  );
}
