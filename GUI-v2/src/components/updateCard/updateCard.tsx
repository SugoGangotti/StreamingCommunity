import { TriangleAlert } from "lucide-react";

interface UpdateCardProps {
  version: string;
  updateAvailable: boolean;
}

export default function UpdateCard({
  version,
  updateAvailable,
}: UpdateCardProps) {
  return (
    <div className="px-4 mt-4">
      <div className="flex flex-col gap-4 rounded-xl bg-gray-800 p-6 sm:flex-row sm:items-center sm:justify-between border border-gray-700">
        <div className="flex flex-col gap-2">
          <h3 className="text-white text-lg font-bold">
            Stato dello script arrowar
          </h3>
          <p className="text-gray-400 text-sm">
            Versione installata:{" "}
            <span className="font-semibold text-white">
              {version} (Obsoleta)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-yellow-400">
          <TriangleAlert aria-hidden />
          <p className="text-sm font-medium">
            {updateAvailable
              ? "È disponibile una nuova versione dello script. Aggiorna per le ultime funzionalità e patch di sicurezza."
              : "Lo script è aggiornato."}
          </p>
        </div>
      </div>
    </div>
  );
}
