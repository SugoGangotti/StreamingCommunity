import WIP from "../components/temp/wip";
import { useState } from "react";

type SearchResult = {
  id: string;
  title: string;
  year: string;
  coverUrl: string;
  type: "movie" | "series";
};

const searchResults: SearchResult[] = [
  {
    id: "1",
    title: "Titolo Film",
    year: "2023",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgnVgTnSQcdOROAt8_JOtj-u9m02Dwy3goADiwC1d9bHOhENTWCXgN2H3JsuNZ_9mOCxiXQnMNwFIWOWqIK0aDSpxSgyQT5FmsnIC7mUuPv4X5zFOZJPKcHxLle5-xT7OgJ6fotNfr316u5fiVHg25DNcBdkbN6ZESIbhSjzduc4gC3ZSH5D4i0DTRy88HfJQvzblw5Ov8Fc4m_Yq2RikTtOpzKclTUJlRzIgzl1m5pVvmuYCtXEb9y_X3i0K9ZYuTT9vEgt28YKc-",
    type: "movie",
  },
  {
    id: "2",
    title: "Titolo Serie TV",
    year: "2022",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBF3cpu_cHDA_Hb_tDP-4DG__h1Mj4cWqdgStJi1WsXUdQTmZu8P763pqVIp2SbfzA81rt63r1kOxkh00V_4JQKZYZab4s4W8tcZ6Ewee47ZNXFajdMowtdI0sDVE3Mbb804Eg4Giq3_-d2fW6QVeYFkatQCC3B-tTuUMEWJJzDmsiHs5qlrROIyOeDJaXpdwp2v6UEshzgJcxFWLSuRHsuEWZhQTxYwFpi7-Pwz9nlSI0MEjYwA1ipXnrtA21TFtIHDGLNmfmXaFVb",
    type: "series",
  },
  {
    id: "3",
    title: "Un Altro Film",
    year: "2024",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRYgxksl4auc0zr4CUfB3K8tKga5z-r-vjIeKFnlPzgSUhFL1ZZg7KDA53gSqXV5RxKEXMAPfwfiGcqtzyvhSjmPkRp0fPhWh7-ni7agj12PdWHrdB3RsJInH4YHdnSA0X3odORPMZLYawcSMQ_WFI4mvuOsncXMJ8E43yFMS-flxZH2rfXbmnNnL5EUn58x8hK0yvBhKulofX-dMDE8zg1tU_W5XJST0wzodxubuEvwBt4XphS5SCymR6pb0y65RYdEgcaNvYIkqL",
    type: "movie",
  },
  {
    id: "4",
    title: "Serie Fantascientifica",
    year: "2021",
    coverUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwAkWq2q0Uj8ljCvM1pHqfqEBhDEXpqHucxMNID7TKYSUkV5CQ0IfpT-wdqqNSlV7ALZLM6Yqb42Ct87WrHtW5Yt_TzOOJ4gMdx1qmPiw8OnjGmI_qrPzD3QUw5yyd8eMVMgYBbMbetGPl53ILNuclMa44K9Pcipc3sA7l2siRIsP8Tl032AzkkepjiLh5UbgJHMJDtCwLW3SGFDepV9EE1tsJZFWtcIalX-H0GCDTqFda9QfYAfPlKrSgw9e_mxXFnLhyiLpYBhb2",
    type: "series",
  },
];

const genres = ["Azione", "Commedia", "Drammatico", "Fantascienza", "Altro"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Drammatico");
  const [yearRange, setYearRange] = useState({ min: 1990, max: 2024 });
  const [server, setServer] = useState("Server 1");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleDownload = (id: string) => {
    console.log("Download:", id);
  };

  const handleReset = () => {
    setQuery("");
    setSelectedGenre("Drammatico");
    setYearRange({ min: 1990, max: 2024 });
    setServer("Server 1");
    setCurrentPage(1);
    setHasSearched(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <WIP />

      <main className="flex-1 px-4 py-10 lg:px-40">
        <div className="mx-auto max-w-[960px]">
          {/* Title */}
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Ricerca Avanzata
              </p>
              <p className="text-gray-400 text-base font-normal leading-normal">
                Trova il tuo film o la tua serie TV.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="px-4 py-3">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-400 flex border-none bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
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
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-gray-800 focus:border-none h-full placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  placeholder="Cerca un film o una serie TV..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 p-4">
            {/* Genre */}
            <div className="flex flex-col gap-3">
              <p className="text-white text-base font-medium leading-normal">
                Genere
              </p>
              <div className="flex gap-3 p-3 flex-wrap pr-4">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 ${
                      selectedGenre === genre
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    <p className="text-sm font-medium leading-normal">
                      {genre}
                    </p>
                    {genre === "Altro" && (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Range */}
            <div className="@container">
              <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
                <p className="text-white text-base font-medium leading-normal w-full shrink-[3]">
                  Anno di uscita
                </p>
                <div className="flex h-[38px] w-full pt-1.5">
                  <div className="flex h-1 w-full rounded-sm bg-gray-600 pl-[10%] pr-[0%]">
                    <div className="relative">
                      <div className="absolute -left-3 -top-1.5 flex flex-col items-center gap-1">
                        <div className="size-4 rounded-full bg-white"></div>
                        <p className="text-white text-sm font-normal leading-normal">
                          {yearRange.min}
                        </p>
                      </div>
                    </div>
                    <div className="h-1 flex-1 rounded-sm bg-blue-600"></div>
                    <div className="relative">
                      <div className="absolute -right-3 -top-1.5 flex flex-col items-center gap-1">
                        <div className="size-4 rounded-full bg-white"></div>
                        <p className="text-white text-sm font-normal leading-normal">
                          {yearRange.max}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Server and Reset */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <label className="text-white text-base font-medium leading-normal">
                  Server di download
                </label>
                <div className="relative">
                  <select
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="appearance-none h-10 w-48 cursor-pointer rounded-lg bg-gray-800 pl-4 pr-10 text-white text-sm font-medium leading-normal focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Server 1</option>
                    <option>Server 2</option>
                    <option>Server 3</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Filtri
              </button>
            </div>
          </div>

          {/* Results */}
          {hasSearched ? (
            <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <img
                    className="w-full h-auto object-cover"
                    src={result.coverUrl}
                    alt={result.title}
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <h3 className="text-white font-bold">{result.title}</h3>
                    <p className="text-sm text-gray-400">{result.year}</p>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <button
                        onClick={() => handleDownload(result.id)}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        <span className="truncate">Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-8 text-center text-gray-400">
              <div>
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
                <p className="text-lg">Nessun risultato trovato.</p>
                <p className="text-sm">
                  Prova a modificare i filtri o a cercare qualcos'altro.
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {hasSearched && searchResults.length > 0 && (
            <div className="flex items-center justify-center space-x-2 p-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {[1, 2, 3, "...", 10].map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white hover:bg-blue-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
                disabled={currentPage === 10}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
