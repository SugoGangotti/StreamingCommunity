import { useState } from "react";
import { CheckCircle, AlertCircle, Clock, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { QueueItemType } from "@/types/QueueItemType";
import QueueCard from "@/components/queue-card/queueCard";

const Queue = () => {
  // Mock data per la coda
  const [queueItems, setQueueItems] = useState<QueueItemType[]>([
    {
      id: "1",
      title: "Inception",
      type: "movie",
      description:
        "A thief who steals corporate secrets through dream-sharing technology.",
      year: 2010,
      rating: 8.8,
      size: "2.1 GB",
      quality: "1080p",
      image: "/images/inception.jpg",
      downloadUrl: "https://example.com/inception",
      status: "downloading",
      progress: 65,
      downloadSpeed: "5.2 MB/s",
      estimatedTime: "3 min",
      addedAt: new Date("2024-01-20T10:30:00"),
    },
    {
      id: "2",
      title: "Breaking Bad - Stagione 1",
      type: "series",
      description:
        "A high school chemistry teacher turned methamphetamine cook.",
      year: 2008,
      rating: 9.5,
      seasons: 5,
      size: "8.5 GB",
      quality: "720p",
      image: "/images/breaking-bad.jpg",
      downloadUrl: "https://example.com/breaking-bad-s1",
      status: "pending",
      addedAt: new Date("2024-01-20T11:15:00"),
    },
    {
      id: "3",
      title: "Attack on Titan",
      type: "anime",
      description:
        "Humanity fights for survival against giant humanoid Titans.",
      year: 2013,
      rating: 9.0,
      seasons: 4,
      size: "12.3 GB",
      quality: "1080p",
      image: "/images/attack-on-titan.jpg",
      downloadUrl: "https://example.com/attack-on-titan",
      status: "pending",
      addedAt: new Date("2024-01-20T12:00:00"),
    },
    {
      id: "4",
      title: "Our Planet",
      type: "documentary",
      description:
        "Experience our planet's natural beauty and examine how climate change impacts all living creatures.",
      year: 2019,
      rating: 9.3,
      size: "4.7 GB",
      quality: "4K",
      image: "/images/our-planet.jpg",
      downloadUrl: "https://example.com/our-planet",
      status: "completed",
      progress: 100,
      addedAt: new Date("2024-01-20T09:45:00"),
    },
    {
      id: "5",
      title: "The Matrix",
      type: "movie",
      description:
        "A computer programmer discovers that reality as he knows it is a simulation.",
      year: 1999,
      rating: 8.7,
      size: "1.8 GB",
      quality: "1080p",
      image: "/images/matrix.jpg",
      downloadUrl: "https://example.com/matrix",
      status: "error",
      addedAt: new Date("2024-01-20T13:30:00"),
      errorCode: "SC-001",
    },
  ]);

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

    const draggedIndex = queueItems.findIndex(
      (item) => item.id === draggedItem,
    );
    const targetIndex = queueItems.findIndex(
      (item) => item.id === targetItemId,
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newQueue = [...queueItems];
    const [draggedElement] = newQueue.splice(draggedIndex, 1);
    newQueue.splice(targetIndex, 0, draggedElement);

    setQueueItems(newQueue);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const removeFromQueue = (itemId: string) => {
    setQueueItems((items) => items.filter((item) => item.id !== itemId));
  };

  const retryDownload = (itemId: string) => {
    setQueueItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "pending",
              progress: 0,
              downloadSpeed: undefined,
              estimatedTime: undefined,
            }
          : item,
      ),
    );
  };

  const togglePauseResume = (itemId: string) => {
    setQueueItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: item.status === "downloading" ? "pending" : "downloading",
            }
          : item,
      ),
    );
  };

  const pendingItems = queueItems.filter((item) => item.status === "pending");
  const downloadingItems = queueItems.filter(
    (item) => item.status === "downloading",
  );
  const completedItems = queueItems.filter(
    (item) => item.status === "completed",
  );
  const errorItems = queueItems.filter((item) => item.status === "error");

  const activeItems = queueItems.filter(
    (item) => item.status !== "completed" && item.status !== "error",
  );

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
        </div>

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
          {/* Active Downloads */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Attivi
            </h2>
            <div className="space-y-2">
              {activeItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nessun download attivo</p>
                </div>
              ) : (
                activeItems.map((item, index) => (
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export { Queue };
