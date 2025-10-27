import WIP from "../components/temp/wip";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Credenziali non valide");
      return;
    }
    localStorage.setItem("authUser", username);
    if (!remember) sessionStorage.setItem("sessionOnly", "1");
    try {
      const prefs = JSON.parse(localStorage.getItem("prefs") || "{}") as {
        defaultPage?: string;
      };
      const target = prefs?.defaultPage || "/";
      nav(target);
    } catch {
      nav("/");
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <WIP />

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11zm0 2c-2.5 0-7 1.25-7 3.75V19a1 1 0 001 1h12a1 1 0 001-1v-2.25C19 14.25 14.5 13 12 13z"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white">Accedi</h1>
        <p className="text-gray-400 mt-2">
          Entra per continuare la ricerca e i download
        </p>
      </div>
      {error && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center p-4 rounded-xl border bg-red-900/50 border-red-700 text-red-300">
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Username o Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12A4 4 0 118 12a4 4 0 018 0z"
                  />
                </svg>
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-3 pl-12 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="es. mario.rossi"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c.667 0 2-1 2-2.5S12.667 6 12 6s-2 .5-2 2.5S11.333 11 12 11zm6 3a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4z"
                  />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-3 pl-12 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              Ricordami
            </label>
            <button
              type="button"
              onClick={() => nav("/")}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Torna alla home
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/40"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
