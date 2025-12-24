import { MoveRight, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const updateVersion = ({
  actualVersion = "0.1.0",
  newVersion = "0.1.1",
}: {
  actualVersion?: string;
  newVersion?: string;
}) => {
  return (
    <Alert
      className={cn(
        "p-6 w-full flex items-center gap-6",
        "bg-blue-200 hover:bg-blue-400 cursor-pointer border-4 border-blue-400"
      )}
      onClick={() => console.log("aggiorna versione")}
    >
      <div>
        <TriangleAlert size="30" className="text-blue-600" />
      </div>

      <div className="flex flex-col gap-1">
        <AlertTitle className="uppercase text-blue-600 font-black text-lg">
          è disponibile una nuova versione
        </AlertTitle>

        <AlertDescription className="flex flex-row gap-1">
          <div className="flex flex-row gap-1">
            <p className="text-black font-medium">Versione installata:</p>

            <p className="text-red-800 font-bold">{actualVersion} (Obsoleta)</p>
          </div>

          <MoveRight className="text-black" size="20" />

          <p className="text-green-800 font-bold">{newVersion} (Nuova)</p>
        </AlertDescription>
      </div>
    </Alert>
  );
};
export default updateVersion;
