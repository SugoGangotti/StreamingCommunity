import { TriangleAlert } from "lucide-react";

export default function WIP() {
  return (
    <div className="px-4 mt-4">
      <div className="flex flex-row gap-4 rounded-xl bg-red-900 p-6 sm:justify-start border border-gray-700">
        <div className="flex items-center gap-2 rounded-lg bg-red-400/10 p-4 text-red-400">
          <TriangleAlert aria-hidden />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-white text-lg font-bold">
            Questa pagina è in corso di lavorazione
          </h3>
          <p className="text-gray-400 text-sm">
            Torna più tardi per nuovi sviluppi
          </p>
        </div>
      </div>
    </div>
  );
}
