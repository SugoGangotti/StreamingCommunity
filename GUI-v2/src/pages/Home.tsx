import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function loadPrefs(): { defaultPage?: string } {
  try {
    return JSON.parse(localStorage.getItem("prefs") || "{}");
  } catch {
    return {};
  }
}

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [defaultPage, setDefaultPage] = useState<string | undefined>(undefined);

  useEffect(() => {
    setUsername(localStorage.getItem("authUser"));
    setDefaultPage(loadPrefs().defaultPage);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <section className="rounded-3xl border border-gray-700 bg-gray-800 p-10 md:p-14 mb-10 text-center gap-6 flex flex-row">
        <div className="mx-auto aspect-square h-fit rounded-2xl bg-blue-600 flex items-center justify-center p-6">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-col text-left h-fit">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Benvenuto{username ? `, ${username}` : ""}!
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Inizia una ricerca, gestisci la tua coda di download, oppure
            personalizza le impostazioni dell'applicazione.
          </p>
        </div>
      </section>
    </div>
  );
}
