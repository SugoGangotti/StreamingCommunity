import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import Queue from "./pages/Queue";
import Settings from "./pages/Settings";
import HomePage from "./pages/Home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/queue" element={<Queue />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
