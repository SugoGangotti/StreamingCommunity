import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import Settings from "./pages/Settings";
import HomePage from "./pages/Home";
import Downloads from "./pages/Downloads";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
