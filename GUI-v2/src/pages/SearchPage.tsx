import ResultsCard from "../components/resultsCard";
import { useEffect, useMemo, useState } from "react";
import { MediaItem } from "../types/MediaItem";

const MOCK_ITEMS: MediaItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  display_title: `Titolo ${i + 1}`,
  display_type: i % 3 === 0 ? "Film" : i % 3 === 1 ? "Serie TV" : "Anime",
  source: i % 2 === 0 ? "StreamingCommunity" : "AnimeUnity",
  source_alias: i % 2 === 0 ? "streamingcommunity" : "animeunity",
  display_release: `${2015 + (i % 10)}`,
  bg_image_url: `https://picsum.photos/seed/sc-${i}/600/900`,
}));

export default function SearchPage() {
  const [site, setSite] = useState("streamingcommunity");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
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
          <ResultsCard key={item.id} item={item} idx={idx} />
        ))}
      </div>
    </div>
  );
}
