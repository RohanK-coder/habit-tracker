import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Habit Tracker</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="outline" onClick={logout}>Log out</Button>
        </div>
      </div>
    </header>
  );
}
