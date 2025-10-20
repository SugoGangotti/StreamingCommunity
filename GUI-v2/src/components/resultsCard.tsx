import { useNavigate } from "react-router-dom";
import { MediaItem } from "../types/MediaItem";

interface ResultsCardProps {
  item: MediaItem;
  idx: number;
}

export default function ResultsCard({ item, idx }: ResultsCardProps) {
  const nav = useNavigate();

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
  );
}
