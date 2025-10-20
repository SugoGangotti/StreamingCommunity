import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type MediaItem = {
  id: string;
  display_title: string;
  display_type: "Film" | "Serie TV" | "Anime";
  source: string;
  source_alias: string;
  display_release?: string;
  bg_image_url?: string;
};

const MOCK_ITEMS: MediaItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  display_title: `Titolo ${i + 1}`,
  display_type: i % 3 === 0 ? "Film" : i % 3 === 1 ? "Serie TV" : "Anime",
  source: i % 2 === 0 ? "StreamingCommunity" : "AnimeUnity",
  source_alias: i % 2 === 0 ? "streamingcommunity" : "animeunity",
  display_release: `${2015 + (i % 10)}`,
  bg_image_url: `https://picsum.photos/seed/sc-${i}/600/900`,
}));

function loadQueue(): any[] {
  try {
    return JSON.parse(localStorage.getItem("watchlist") || "[]");
  } catch {
    return [];
  }
}

function saveQueue(items: any[]) {
  localStorage.setItem("watchlist", JSON.stringify(items));
}

export default function HomePage() {
  const [site, setSite] = useState("streamingcommunity");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const nav = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return results.filter(
      (r) =>
        (site ? r.source_alias === site : true) &&
        (q ? r.display_title.toLowerCase().includes(q) : true)
    );
  }, [results, site, query]);

  useEffect(() => {
    setResults(MOCK_ITEMS);
  }, []);

  const addToQueue = (item: MediaItem) => {
    const q = loadQueue();
    const key = `${item.source_alias}::${item.id}::${item.display_title}`;
    if (q.some((w: any) => w._k === key)) return;
    q.push({
      ...item,
      _k: key,
      job_id: crypto.randomUUID(),
      status: "pending",
      added_at: new Date().toISOString(),
    });
    saveQueue(q);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center mb-6 lg:mb-0">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-white"
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
          <div>
            <h1 className="text-lg font-bold text-white">StreamingCommunity</h1>
            <p className="text-gray-400 text-sm">Ricerca</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex-1 lg:max-w-lg xl:max-w-2xl">
          <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                  />
                </svg>
              </div>
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-2 pl-10 pr-10"
              >
                <option value="streamingcommunity">StreamingCommunity</option>
                <option value="animeunity">AnimeUnity</option>
              </select>
            </div>
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
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
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cosa cerchi?"
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-2 pl-10 pr-10"
              />
            </div>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={() => {
                /* filter occurs via state */
              }}
            >
              Cerca
            </button>
          </form>
        </div>
        <div className="mt-4 lg:mt-0 lg:ml-4">
          <button
            onClick={() => {
              setQuery("");
              setSite("streamingcommunity");
            }}
            className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            Nuova ricerca
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-700 transition relative overflow-hidden card-2-3 flex flex-col"
            style={{ animationDelay: `${idx}00ms` }}
          >
            {item.bg_image_url && (
              <>
                <div
                  className="absolute inset-0 opacity-20 bg-center bg-cover"
                  style={{ backgroundImage: `url('${item.bg_image_url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
              </>
            )}
            <div className="relative mt-auto">
              <div className="mb-4">
                <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                  {item.display_title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                    {item.display_type}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                    {item.source}
                  </span>
                </div>
                {item.display_release && (
                  <div className="mt-2 text-xs text-gray-300">
                    {item.display_release}
                  </div>
                )}
              </div>
              <div className="flex items-stretch gap-2">
                <button
                  onClick={() => addToQueue(item)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg"
                >
                  Aggiungi alla coda
                </button>
                <button
                  onClick={() => {
                    addToQueue(item);
                    nav("/queue");
                  }}
                  aria-label="Vai alla coda"
                  className="w-12 aspect-square bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
