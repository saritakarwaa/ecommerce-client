import { Label } from "./label";
import { Button } from "./button";
import { Input } from "./input";
interface AuthFormProps{
    type:"login" | "signup";
    onSubmit:(data:Record<string,string>)=>void;
    loading?:boolean
}

export default function AuthForm({type,onSubmit,loading=false}:AuthFormProps){
    const isSignup=type==="signup"

    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const form=e.currentTarget
        const data=new FormData(form)

        const payload:Record<string,string>={};
        data.forEach((value,key)=>{
            payload[key]=value.toString()
        })

        onSubmit(payload)
    }
    return(
        <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
            <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" placeholder="Your name" required />
            </div>
        )}
        <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
        </div>
        <div>
            <Label htmlFor="password">Password</Label>
            <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Register" : "Login"}
        </Button>
        </form>
    )
}