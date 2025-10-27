import { Link, useLocation } from "react-router-dom";
import LogoAndText from "./subComp/logoAndText";

import { Settings } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:text-white hover:bg-gray-700";

  return (
    <nav className="mb-8 flex items-center justify-between bg-gray-800/70 border border-gray-700 rounded-xl px-4 py-3">
      <LogoAndText />
      <div className="flex items-center gap-2">
        <Link
          to="/search"
          className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive(
            "/search"
          )}`}
        >
          Search
        </Link>

        <Link
          to="/downloads"
          className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive(
            "/downloads"
          )}`}
        >
          Downloads
        </Link>

        <Link
          to="/settings"
          className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive(
            "/settings"
          )}`}
        >
          <Settings />
        </Link>
      </div>
    </nav>
  );
}
