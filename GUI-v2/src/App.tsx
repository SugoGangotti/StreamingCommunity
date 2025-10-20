import Navbar from "./components/navbar/navbar";
import AppRoutes from "./routes";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <Navbar />
        <AppRoutes />
      </div>
    </div>
  );
}
