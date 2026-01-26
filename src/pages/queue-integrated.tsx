// Esempio di pagina Queue integrata con il Frontend Manager

import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QueueCard from "@/components/queue-card/queueCard";
import InDownloadCard from "@/components/queue-card/inDownloadCard";
import { useQueue, useBackend } from "@/hooks";

const QueueIntegrated = () => {
  // Hook per il backend
  const {
    isAvailable,
    isLoading: backendLoading,
    error: backendError,
    retryConnection,
  } = useBackend();

  // Hook per la coda con auto-refresh ogni 5 secondi
  const {
    downloads,
    isLoading: queueLoading,
    error: queueError,
    refreshStatus,
  } = useQueue(true, 5000);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (itemId: string) => {
    setDragOverItem(itemId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    setDragOverItem(null);

    if (!draggedItem || draggedItem === targetItemId) return;

    // Nota: Il riordinamento richiederà un endpoint aggiuntivo nel backend
    // Per ora mostriamo solo la logica UI
    console.log(`Riordinamento: ${draggedItem} -> ${targetItemId}`);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const removeFromQueue = (itemId: string) => {
    // Nota: La rimozione richiederà un endpoint DELETE nel backend
    console.log(`Rimozione item: ${itemId}`);
  };

  const retryDownload = (itemId: string) => {
    // Nota: Il retry richiederà un endpoint specifico nel backend
    console.log(`Retry download: ${itemId}`);
  };

  const togglePauseResume = (itemId: string) => {
    // Nota: Pause/resume richiederanno endpoint specifici nel backend
    console.log(`Toggle pause/resume: ${itemId}`);
  };

  // Filtra gli elementi per stato
  const pendingItems = downloads.filter((item) => item.status === "pending");
  const downloadingItems = downloads.filter(
    (item) => item.status === "downloading",
  );
  const completedItems = downloads.filter(
    (item) => item.status === "completed",
  );
  const errorItems = downloads.filter((item) => item.status === "error");

  const queueCardProps = {
    retryDownload,
    togglePauseResume,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    dragOverItem,
    draggedItem,
    removeFromQueue,
  };

  // Mostra errore di backend
  if (!isAvailable && backendError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <WifiOff className="h-12 w-12 mx-auto text-muted-foreground" />
          <Alert variant="destructive">
            <AlertDescription>{backendError}</AlertDescription>
          </Alert>
          <Button onClick={retryConnection} disabled={backendLoading}>
            {backendLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Riprova la connessione
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Coda Download
          </h1>
          <p className="text-muted-foreground">
            Gestisci e riordina i tuoi download
          </p>
          {!isAvailable && (
            <p className="text-sm text-orange-600">
              Connessione al backend in corso...
            </p>
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStatus}
            disabled={queueLoading || !isAvailable}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${queueLoading ? "animate-spin" : ""}`}
            />
            Aggiorna
          </Button>
        </div>

        {/* Error State */}
        {queueError && (
          <Alert variant="destructive">
            <AlertDescription>{queueError}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {(queueLoading || backendLoading) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Caricamento coda...</span>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {downloadingItems.length}
            </div>
            <div className="text-sm text-muted-foreground">In Download</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-500">
              {pendingItems.length}
            </div>
            <div className="text-sm text-muted-foreground">In Attesa</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {completedItems.length}
            </div>
            <div className="text-sm text-muted-foreground">Completati</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {errorItems.length}
            </div>
            <div className="text-sm text-muted-foreground">Errori</div>
          </Card>
        </div>

        {/* Queue List */}
        <div className="space-y-6">
          {/* Currently Downloading */}
          {downloadingItems.length > 0 && (
            <InDownloadCard
              downloadingItems={downloadingItems}
              removeFromQueue={removeFromQueue}
              retryDownload={retryDownload}
              togglePauseResume={togglePauseResume}
            />
          )}

          {/* Active Downloads */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Coda Download
            </h2>
            <div className="space-y-2">
              {pendingItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nessun elemento in coda</p>
                </div>
              ) : (
                pendingItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 w-full h-full"
                  >
                    {/* Fixed Number Outside Card */}
                    <div className="text-lg font-bold text-gray-500 w-8 text-center pt-4 h-full flex items-center">
                      #{index + 1}
                    </div>

                    <QueueCard {...queueCardProps} item={item} />
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Completed Downloads */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Download Completati
            </h2>
            <div className="space-y-2">
              {completedItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nessun download completato</p>
                </div>
              ) : (
                completedItems.map((item) => (
                  <QueueCard {...queueCardProps} item={item} />
                ))
              )}
            </div>
          </Card>

          {/* Error Downloads */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Download con Errori
            </h2>
            <div className="space-y-2">
              {errorItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nessun download con errori</p>
                </div>
              ) : (
                errorItems.map((item) => (
                  <QueueCard {...queueCardProps} item={item} />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-muted/50">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              • Trascina gli elementi per riordinare la coda (solo per elementi
              non in download)
            </p>
            <p>• Solo un file può essere scaricato alla volta</p>
            <p>
              • I download completati vengono spostati automaticamente nella
              sezione "Download Completati"
            </p>
            <p>
              • I download con errori vengono spostati nella sezione "Download
              con Errori"
            </p>
            <p>
              • Usa i pulsanti per mettere in pausa/riprendere, riprovare o
              rimuovere i download
            </p>
            <p>• La coda si aggiorna automaticamente ogni 5 secondi</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { QueueIntegrated };
