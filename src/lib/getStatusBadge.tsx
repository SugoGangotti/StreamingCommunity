import { Badge } from "@/components/ui/badge";
import type { QueueItemType } from "@/types/QueueItemType";

export const getStatusBadge = (status: QueueItemType["status"]) => {
  switch (status) {
    case "downloading":
      return <Badge className="bg-blue-500">In Download</Badge>;
    case "completed":
      return <Badge className="bg-green-500">Completato</Badge>;
    case "error":
      return <Badge className="bg-red-500">Errore</Badge>;
    case "pending":
      return <Badge variant="secondary">In Attesa</Badge>;
    default:
      return <Badge variant="secondary">In Attesa</Badge>;
  }
};
