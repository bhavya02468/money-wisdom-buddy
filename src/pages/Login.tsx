import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, KeyRound } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "users" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
      navigate("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials",
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">Welcome to FinWise</h1>
          <p className="text-text-light mt-2">Sign in to access your dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-text-light" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-text-light" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;