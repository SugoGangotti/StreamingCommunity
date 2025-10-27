import { useState } from "react";
import { FolderSearch, Trash2 } from "lucide-react";
import WIP from "../components/temp/wip";

type InProgressItem = {
  id: string;
  title: string;
  progress: number;
  speed: string;
  coverUrl: string;
};

type CompletedItem = {
  id: string;
  title: string;
  coverUrl: string;
};

type NextItem = {
  id: string;
  title: string;
  order: number;
  coverUrl: string;
};

export default function Downloads() {
  const [inProgress, setInProgress] = useState<InProgressItem[]>([
    {
      id: "arrow-s01e01",
      title: "Arrow - S01E01",
      progress: 55,
      speed: "2.5 MB/s",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDX316ul8jc0nVP2_rVtFd78ZKfyO7GF14Gcg3xsbhlnNlkEwH09YweG_ZDSDCEQi2IeBg_--7rBbdQ2_BsEcAcTKBLMma_tDHz0-yJF04SGLmHJst3gooRqKGqX9BTK61rMSDzVWnB_wV1G0JvKPV8EZSDcKsehxg9Ign89kkj59MBNRKhJWTT6KcWY5NQ7erfqMfd4LYzSUmKsJHv13AXpumgqTDiSaNhP_5U6ASkII67CVF6cIDIR5fNYuwj9ULTOWyWgPepvXJ5",
    },
  ]);

  const [next, setNext] = useState<NextItem[]>([
    {
      id: "arrow-s01e01",
      title: "Arrow - S01E01",
      order: 1,
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDX316ul8jc0nVP2_rVtFd78ZKfyO7GF14Gcg3xsbhlnNlkEwH09YweG_ZDSDCEQi2IeBg_--7rBbdQ2_BsEcAcTKBLMma_tDHz0-yJF04SGLmHJst3gooRqKGqX9BTK61rMSDzVWnB_wV1G0JvKPV8EZSDcKsehxg9Ign89kkj59MBNRKhJWTT6KcWY5NQ7erfqMfd4LYzSUmKsJHv13AXpumgqTDiSaNhP_5U6ASkII67CVF6cIDIR5fNYuwj9ULTOWyWgPepvXJ5",
    },
    {
      id: "the-boys-s02e04",
      title: "The Boys - S02E04",
      order: 2,
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCRfJL-FobjdOZIiOFBJkhB2QsUAlc4ajRQhcbyfdoHn3k8UeCIKpdgWClPgZEN_OKKRFhhMEjUHQ4O5sXMEtiDQdIVLl2JiSkXc63VJFGPgx04izQmzwcw1WU_16EU2iWdjco-LEgA6O5Ff17_wUfhIRIAjO5LCagN08znX3hzeq0-VadsBP03kbjU93SX8CwGzgGd7Jch9i4dcRXtHMXq6FEr1jWB5qaPR-IROhHj7b1j4yAAxwDQPcMejASsfKvIarojYw6LEo0Q",
    },
  ]);

  const [completed, setCompleted] = useState<CompletedItem[]>([
    {
      id: "mr-robot-s04e11",
      title: "Mr. Robot - S04E11",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAWbQhjRBZcErjUJao3M-Qrt7J-AYVjiDBv12dtPdT_1e8dycB2B53JDop_5t_O1i4JlxVIQyLY580SST56_a0siqOdg85zyKKbNAwxcvq36k13rHTp8KRu2iLma8WSkOwyZSsfpCfQUClrzv3o-zk8Msx9zSN3k7ZHPWbSd9ns8ZLVHRvVUuN2XktjIYkP8VPViFNXOBauuxDHk57SOLK6nh_xm6sQhnIiwqh4ds7gipiiov9kVJ24xDmwoMXRlbASD1GjXdQJ-sRZ",
    },
    {
      id: "the-matrix",
      title: "The Matrix",
      coverUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB-BDrD3ffVvGM8smBCIecowWR9GAC-UF-bOja1GQBERsTOsKM9kipl911VR1lZsBeIORWIVl5u92oyCNcZyidhW8QZ1--DOQaCrbEtnMHXc5LaHlUxX41mdysgsfEihFCqMk5a9evJQ_oMPwWl2zGYgr96sDzYW_uU5P0rHPI9coVmmpp5kZplQKfXEnLbKQ_BwUgHvgux7BHCSu6bqqhRne4r4cXui9PhzcU3or52qMPOUAj0o9otMYCFfMxmukCCU2aaWhBSHedF",
    },
  ]);

  const pause = (id: string) => {
    setInProgress((prev) =>
      prev.map((i) => (i.id === id ? { ...i, speed: "In pausa" } : i))
    );
  };
  const cancel = (id: string) => {
    setInProgress((prev) => prev.filter((i) => i.id !== id));
  };
  const FileLocation = (id: string) => {
    void id;
  };
  const removeCompleted = (id: string) => {
    setCompleted((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <WIP />

      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          La mia Coda di Download
        </p>
      </div>

      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 mt-6">
        Download in Corso
      </h2>
      <div className="flex flex-col gap-4 p-4">
        {inProgress.map((item) => (
          <div
            key={item.id}
            className="flex items-stretch justify-between gap-6 p-4 rounded-lg bg-white/5"
          >
            <div className="flex-shrink-0 w-24">
              <div
                className="w-full bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-lg"
                style={{ backgroundImage: `url('${item.coverUrl}')` }}
              />
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1">
                <p className="text-white text-lg font-bold leading-tight">
                  {item.title}
                </p>
                <p className="text-white/60 text-sm font-normal leading-normal">
                  {item.speed === "In pausa"
                    ? "In pausa"
                    : `In download... ${item.progress}%  • ${item.speed}`}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5">
                <div
                  className={`${
                    item.speed === "In pausa" ? "bg-amber-500" : "bg-green-500"
                  } h-2.5 rounded-full`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <div className="flex items-center gap-3 mt-auto">
                <button
                  onClick={() => pause(item.id)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-medium leading-normal gap-2 transition-colors"
                >
                  <span className="text-base">⏸️</span>
                  <span className="truncate">Pausa</span>
                </button>
                <button
                  onClick={() => cancel(item.id)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 text-sm font-medium leading-normal gap-2 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <span className="text-base">✖️</span>
                  <span className="truncate">Annulla</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {inProgress.length === 0 && (
          <div className="text-white/60 px-4">Nessun download in corso.</div>
        )}
      </div>

      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 mt-6">
        Prossimi Download
      </h2>
      <div className="flex flex-col gap-4 p-4">
        {next.map((item) => (
          <div
            key={item.id}
            className="flex items-stretch justify-between gap-6 p-4 rounded-lg bg-white/5"
          >
            <div className="flex-shrink-0 w-24">
              <div
                className="w-full bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-lg"
                style={{ backgroundImage: `url('${item.coverUrl}')` }}
              />
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1">
                <p className="text-white text-lg font-bold leading-tight">
                  {item.title}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <button
                  onClick={() => pause(item.id)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-medium leading-normal gap-2 transition-colors"
                >
                  <span className="text-base">⏸️</span>
                  <span className="truncate">Pausa</span>
                </button>

                <button
                  onClick={() => cancel(item.id)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 text-sm font-medium leading-normal gap-2 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <span className="text-base">✖️</span>
                  <span className="truncate">Annulla</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {next.length === 0 && (
          <div className="text-white/60 px-4">Nessun download in coda.</div>
        )}
      </div>

      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 mt-8">
        Download Completati
      </h2>
      <div className="flex flex-col gap-4 p-4">
        {completed.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-6 p-4 rounded-lg bg-white/5"
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="flex-shrink-0 w-24">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-lg"
                  style={{ backgroundImage: `url('${item.coverUrl}')` }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white text-lg font-bold leading-tight">
                  {item.title}
                </p>
                <p className="text-white/60 text-sm font-normal leading-normal">
                  Completato
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => FileLocation(item.id)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-green-600 text-white text-sm font-medium leading-normal gap-2 hover:bg-green-700 transition-colors"
              >
                <FolderSearch />
                <span className="truncate">Posizione</span>
              </button>
              <button
                onClick={() => removeCompleted(item.id)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 text-sm font-medium leading-normal gap-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Trash2 />
                <span className="truncate">Rimuovi</span>
              </button>
            </div>
          </div>
        ))}
        {completed.length === 0 && (
          <div className="text-center py-16 px-4 rounded-lg bg-white/5 mt-4">
            <p className="text-white/60">
              Non ci sono altri download completati.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
