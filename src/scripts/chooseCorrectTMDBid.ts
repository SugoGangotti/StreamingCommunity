import { debugLog, debugError } from "./debug";
import { findTMDBId, type TMDBSearchResult } from "./findTMDBid";
import type { MediaItemType } from "@/types/MediaItemType";

/**
 * Punteggio di confidenza per il match tra media item e risultato TMDB
 */
interface MatchScore {
  result: TMDBSearchResult;
  score: number;
  reasons: string[];
}

/**
 * Converte il tipo MediaItemType in tipo TMDB
 */
const convertMediaType = (mediaType: MediaItemType["type"]): "movie" | "tv" => {
  return mediaType === "movie" ? "movie" : "tv";
};

/**
 * Calcola il punteggio di match per un risultato TMDB
 */
const calculateMatchScore = (
  mediaItem: MediaItemType,
  tmdbResult: TMDBSearchResult,
): MatchScore => {
  let score = 0;
  const reasons: string[] = [];

  // 1. Match del tipo (movie/series/anime -> movie/tv)
  const expectedMediaType = convertMediaType(mediaItem.type);
  if (tmdbResult.media_type === expectedMediaType) {
    score += 30;
    reasons.push(`Tipo corretto: ${tmdbResult.media_type}`);
  } else {
    reasons.push(
      `Tipo errato: ${tmdbResult.media_type} vs ${expectedMediaType}`,
    );
  }

  // 2. Match del titolo (case-insensitive)
  const itemTitle = mediaItem.title.toLowerCase().trim();
  const tmdbTitle = (tmdbResult.title || tmdbResult.name || "")
    .toLowerCase()
    .trim();

  if (itemTitle === tmdbTitle) {
    score += 40;
    reasons.push("Titolo esatto");
  } else if (tmdbTitle.includes(itemTitle) || itemTitle.includes(tmdbTitle)) {
    score += 20;
    reasons.push("Titolo parziale");
  } else {
    // Similarità fuzzy semplice
    const similarity = calculateStringSimilarity(itemTitle, tmdbTitle);
    if (similarity > 0.7) {
      score += 15;
      reasons.push(`Titolo simile (${Math.round(similarity * 100)}%)`);
    }
  }

  // 3. Match dell'anno (se presente)
  if (mediaItem.year) {
    const tmdbYear =
      tmdbResult.release_date?.substring(0, 4) ||
      tmdbResult.first_air_date?.substring(0, 4);

    if (tmdbYear && parseInt(tmdbYear) === mediaItem.year) {
      score += 25;
      reasons.push(`Anno esatto: ${tmdbYear}`);
    } else if (tmdbYear && Math.abs(parseInt(tmdbYear) - mediaItem.year) <= 1) {
      score += 10;
      reasons.push(`Anno vicino: ${tmdbYear} vs ${mediaItem.year}`);
    }
  }

  // 4. Bonus per presenza del poster
  if (tmdbResult.poster_path) {
    score += 5;
    reasons.push("Poster disponibile");
  }

  // 5. Bonus per anime (se il tipo è anime e il risultato è tv con parole chiave anime)
  if (mediaItem.type === "anime" && tmdbResult.media_type === "tv") {
    const animeKeywords = ["anime", "animation", "cartoon", "manga"];
    const overview = (tmdbResult.overview || "").toLowerCase();
    const title = (tmdbResult.title || tmdbResult.name || "").toLowerCase();

    if (
      animeKeywords.some(
        (keyword) => overview.includes(keyword) || title.includes(keyword),
      )
    ) {
      score += 15;
      reasons.push("Rilevato come anime");
    }
  }

  return { result: tmdbResult, score, reasons };
};

/**
 * Calcola similarità tra due stringhe (algoritmo semplice)
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calcola distanza di Levenshtein tra due stringhe
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator,
      );
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * Sceglie l'ID TMDB corretto basandosi sui dati del media item
 * @param mediaItem - Item media da confrontare
 * @param minScore - Punteggio minimo per considerare un match valido (default: 50)
 * @returns Promise con il risultato migliore o null se nessun match soddisfacente
 */
export const chooseCorrectTMDBId = async (
  mediaItem: MediaItemType,
  minScore: number = 50,
): Promise<TMDBSearchResult | null> => {
  debugLog(`Choosing correct TMDB ID for: "${mediaItem.title}"`, {
    type: mediaItem.type,
    year: mediaItem.year,
    seasons: mediaItem.seasons,
  });

  try {
    // Converti il tipo per la ricerca TMDB
    const tmdbMediaType = convertMediaType(mediaItem.type);

    // Cerca risultati su TMDB
    const results = await findTMDBId(
      mediaItem.title,
      tmdbMediaType,
      mediaItem.year,
    );

    if (results.length === 0) {
      debugLog("No TMDB results found");
      return null;
    }

    debugLog(`Found ${results.length} TMDB results, calculating match scores`);

    // Calcola punteggi per ogni risultato
    const scores: MatchScore[] = results.map((result) =>
      calculateMatchScore(mediaItem, result),
    );

    // Ordina per punteggio decrescente
    scores.sort((a, b) => b.score - a.score);

    // Log dei migliori risultati
    debugLog("Top 3 match scores:");
    scores.slice(0, 3).forEach((score, index) => {
      debugLog(
        `${index + 1}. Score: ${score.score} - ${score.result.title || score.result.name}`,
        score.reasons,
      );
    });

    // Prendi il miglior risultato se supera la soglia minima
    const bestMatch = scores[0];

    if (bestMatch.score >= minScore) {
      debugLog(
        `Best match selected with score: ${bestMatch.score}`,
        bestMatch.reasons,
      );
      return bestMatch.result;
    } else {
      debugLog(
        `No match above minimum score (${minScore}). Best was: ${bestMatch.score}`,
      );
      return null;
    }
  } catch (error) {
    debugError("Error choosing correct TMDB ID", error);
    return null;
  }
};

/**
 * Sceglie l'ID TMDB corretto e restituisce solo l'ID
 * @param mediaItem - Item media da confrontare
 * @param minScore - Punteggio minimo per considerare un match valido
 * @returns Promise con l'ID TMDB o null
 */
export const chooseCorrectTMDBIdOnly = async (
  mediaItem: MediaItemType,
  minScore: number = 50,
): Promise<number | null> => {
  const result = await chooseCorrectTMDBId(mediaItem, minScore);
  return result ? result.id : null;
};

/**
 * Verifica se un TMDB ID corrisponde al media item
 * @param mediaItem - Item media da verificare
 * @param tmdbId - ID TMDB da verificare
 * @returns Promise con true se corrisponde, false altrimenti
 */
export const verifyTMDBId = async (
  mediaItem: MediaItemType,
  tmdbId: number,
): Promise<boolean> => {
  try {
    const result = await chooseCorrectTMDBId(mediaItem, 30); // Soglia più bassa per verifica
    return result ? result.id === tmdbId : false;
  } catch (error) {
    debugError("Error verifying TMDB ID", error);
    return false;
  }
};

/**
 * Ottiene tutti i possibili match con i loro punteggi
 * @param mediaItem - Item media da analizzare
 * @returns Promise con array di match scores ordinati per punteggio
 */
export const getAllTMDBMatches = async (
  mediaItem: MediaItemType,
): Promise<MatchScore[]> => {
  try {
    const tmdbMediaType = convertMediaType(mediaItem.type);
    const results = await findTMDBId(
      mediaItem.title,
      tmdbMediaType,
      mediaItem.year,
    );

    const scores: MatchScore[] = results.map((result) =>
      calculateMatchScore(mediaItem, result),
    );

    return scores.sort((a, b) => b.score - a.score);
  } catch (error) {
    debugError("Error getting all TMDB matches", error);
    return [];
  }
};
