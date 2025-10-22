import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "@/pages/Dashboard";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import { useAuth } from "@/context/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
