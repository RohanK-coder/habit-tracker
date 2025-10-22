import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password);
      nav("/");
    } catch (e: any) {
      toast({ title: "Registration failed", description: e?.response?.data?.error || "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>You'll start with default habits</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>{loading ? "Creating..." : "Sign up"}</Button>
          </form>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
