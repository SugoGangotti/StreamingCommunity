import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, CheckCircle, XCircle } from "lucide-react";
import { chooseCorrectTMDBId } from "@/scripts/chooseCorrectTMDBid";
import { createItemFromTMDBid } from "@/scripts/createItemFromTMDBid";
import { initializeTMDBKey } from "@/scripts/findTMDBid";
import { loadSettings } from "@/scripts/loadSettings";

import type { FoundMediaItemType } from "@/types/FoundMediaItemType";
import type { MediaItemType } from "@/types/MediaItemType";
import type { TMDBSearchResult } from "@/scripts/findTMDBid";
import type { SettingsStateType } from "@/types/SettingsStateType";

export default function TestTMDBPage() {
  const [mediaItem, setMediaItem] = useState<Partial<FoundMediaItemType>>({
    title: "",
    type: "movie",
    year: undefined,
    seasons: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TMDBSearchResult | null>(null);
  const [mediaItemResult, setMediaItemResult] = useState<MediaItemType | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsStateType>({});

  // Carica i settings all'avvio
  useEffect(() => {
    loadSettings(setSettings);
  }, []);

  const handleTest = async () => {
    if (!mediaItem.title?.trim()) {
      setError("Inserisci un titolo");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setMediaItemResult(null);

    try {
      // Inizializza API key dai settings
      initializeTMDBKey(settings);

      const item: FoundMediaItemType = {
        id: "test",
        title: mediaItem.title!,
        type: mediaItem.type!,
        year: mediaItem.year,
        seasons: mediaItem.seasons,
        size: "1 GB",
        quality: "1080p",
        downloadUrl: "",
      };

      // Test chooseCorrectTMDBId
      const bestMatch = await chooseCorrectTMDBId(item);
      setResult(bestMatch);

      // Crea MediaItemType completo dal TMDB ID con il tipo corretto
      if (bestMatch) {
        const tmdbMediaType = bestMatch.media_type === "movie" ? "movie" : "tv";
        const fullMediaItem = await createItemFromTMDBid(
          bestMatch.id,
          tmdbMediaType,
          {
            downloadUrl: "https://example.com/download",
            size: "1 GB",
            quality: "1080p",
          },
        );
        setMediaItemResult(fullMediaItem);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test TMDB ID Selection</h1>
        <p className="text-muted-foreground">
          Testa la funzione chooseCorrectTMDBId per trovare l'ID TMDB corretto
          basandosi sui dati del media item
        </p>
      </div>

      {/* API Key Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>TMDB API Key Status</CardTitle>
          <CardDescription>
            Stato della API key di TMDB caricata dai settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {settings.tmdb_api_key ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600">API Key configurata</span>
                <Badge variant="secondary">Configurata</Badge>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-600">API Key non configurata</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Item Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Media Item Test</CardTitle>
          <CardDescription>
            Inserisci i dati del media item da testare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Titolo *</label>
              <Input
                placeholder="Es: Inception"
                value={mediaItem.title || ""}
                onChange={(e) =>
                  setMediaItem((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <Select
                value={mediaItem.type}
                onValueChange={(value: "movie" | "series" | "anime") =>
                  setMediaItem((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Anno (opzionale)
              </label>
              <Input
                type="number"
                placeholder="Es: 2010"
                value={mediaItem.year || ""}
                onChange={(e) =>
                  setMediaItem((prev) => ({
                    ...prev,
                    year: e.target.value ? parseInt(e.target.value) : undefined,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Stagioni (opzionale)
              </label>
              <Input
                type="number"
                placeholder="Es: 5"
                value={mediaItem.seasons || ""}
                onChange={(e) =>
                  setMediaItem((prev) => ({
                    ...prev,
                    seasons: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>

          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ricerca in corso...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Trova TMDB ID
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-600">
              <XCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Match Result */}
      {result && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Miglior Match Trovato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Dettagli TMDB</h4>
                <p>
                  <strong>ID:</strong> {result.id}
                </p>
                <p>
                  <strong>Titolo:</strong> {result.title || result.name}
                </p>
                <p>
                  <strong>Tipo:</strong> {result.media_type}
                </p>
                <p>
                  <strong>Anno:</strong>{" "}
                  {result.release_date?.substring(0, 4) ||
                    result.first_air_date?.substring(0, 4)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Media Item</h4>
                <p>
                  <strong>Titolo:</strong> {mediaItem.title}
                </p>
                <p>
                  <strong>Tipo:</strong> {mediaItem.type}
                </p>
                <p>
                  <strong>Anno:</strong> {mediaItem.year || "N/A"}
                </p>
                <p>
                  <strong>Stagioni:</strong> {mediaItem.seasons || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MediaItemType Completo */}
      {mediaItemResult && (
        <Card>
          <CardHeader>
            <CardTitle>MediaItemType Completo</CardTitle>
            <CardDescription>
              Dati completi per l'oggetto MediaItemType generato dal TMDB ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold mb-2 text-lg">
                  Informazioni Base
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID:</strong> {mediaItemResult.id}
                  </div>
                  <div>
                    <strong>Titolo:</strong> {mediaItemResult.title}
                  </div>
                  <div>
                    <strong>Tipo:</strong> {mediaItemResult.type}
                  </div>
                  <div>
                    <strong>TMDB ID:</strong> {mediaItemResult.tmdbId}
                  </div>
                  <div>
                    <strong>Anno:</strong> {mediaItemResult.year || "N/A"}
                  </div>
                  <div>
                    <strong>Rating:</strong> {mediaItemResult.rating || "N/A"}
                  </div>
                  <div>
                    <strong>Adult:</strong>{" "}
                    {mediaItemResult.adult ? "Sì" : "No"}
                  </div>
                  <div>
                    <strong>Lingua Originale:</strong>{" "}
                    {mediaItemResult.original_language || "N/A"}
                  </div>
                </div>
              </div>

              {/* Media Specific Info */}
              <div>
                <h4 className="font-semibold mb-2 text-lg">
                  Informazioni Media
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Dimensione:</strong> {mediaItemResult.size}
                  </div>
                  <div>
                    <strong>Qualità:</strong> {mediaItemResult.quality}
                  </div>
                  <div>
                    <strong>Download URL:</strong>{" "}
                    {mediaItemResult.downloadUrl || "N/A"}
                  </div>
                  <div>
                    <strong>Poster Path:</strong>{" "}
                    {mediaItemResult.poster_path || "N/A"}
                  </div>
                </div>
              </div>

              {/* Movie Specific */}
              {mediaItemResult.type === "movie" && (
                <div>
                  <h4 className="font-semibold mb-2 text-lg">Dettagli Film</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Data Uscita:</strong>{" "}
                      {mediaItemResult.release_date || "N/A"}
                    </div>
                    <div>
                      <strong>Durata:</strong>{" "}
                      {mediaItemResult.duration || "N/A"} minuti
                    </div>
                    <div>
                      <strong>Titolo Originale:</strong>{" "}
                      {mediaItemResult.original_title || "N/A"}
                    </div>
                  </div>
                </div>
              )}

              {/* Series Specific */}
              {mediaItemResult.type === "series" && (
                <div>
                  <h4 className="font-semibold mb-2 text-lg">
                    Dettagli Serie TV
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Prima Messa in Onda:</strong>{" "}
                      {mediaItemResult.first_air_date || "N/A"}
                    </div>
                    <div>
                      <strong>Ultima Messa in Onda:</strong>{" "}
                      {mediaItemResult.last_air_date || "N/A"}
                    </div>
                    <div>
                      <strong>Numero Stagioni:</strong>{" "}
                      {mediaItemResult.number_of_seasons || "N/A"}
                    </div>
                    <div>
                      <strong>Numero Episodi:</strong>{" "}
                      {mediaItemResult.number_of_episodes || "N/A"}
                    </div>
                    <div>
                      <strong>In Produzione:</strong>{" "}
                      {mediaItemResult.in_production ? "Sì" : "No"}
                    </div>
                    <div>
                      <strong>Lingue:</strong>{" "}
                      {mediaItemResult.languages?.join(", ") || "N/A"}
                    </div>
                  </div>

                  {/* Seasons Info */}
                  {mediaItemResult.seasons &&
                    Array.isArray(mediaItemResult.seasons) &&
                    mediaItemResult.seasons.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold mb-2">Stagioni:</h5>
                        <div className="space-y-2">
                          {mediaItemResult.seasons.map((season, index) => (
                            <div
                              key={index}
                              className="border rounded p-2 text-sm"
                            >
                              <div>
                                <strong>
                                  Stagione {season.season_number}:
                                </strong>{" "}
                                {season.name}
                              </div>
                              <div>
                                <strong>Episodi:</strong> {season.episode_count}
                              </div>
                              <div>
                                <strong>Data:</strong>{" "}
                                {season.air_date || "N/A"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Genres */}
              {mediaItemResult.genres && mediaItemResult.genres.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-lg">Generi</h4>
                  <div className="flex flex-wrap gap-2">
                    {mediaItemResult.genres.map(
                      (genre: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {genre}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Countries */}
              {mediaItemResult.original_country &&
                mediaItemResult.original_country.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-lg">Paesi</h4>
                    <div className="flex flex-wrap gap-2">
                      {mediaItemResult.original_country.map(
                        (country: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {country}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Description */}
              {mediaItemResult.description && (
                <div>
                  <h4 className="font-semibold mb-2 text-lg">Descrizione</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {mediaItemResult.description}
                  </p>
                </div>
              )}

              {/* JSON Preview */}
              <div>
                <h4 className="font-semibold mb-2 text-lg">JSON Preview</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs">
                    {JSON.stringify(mediaItemResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
