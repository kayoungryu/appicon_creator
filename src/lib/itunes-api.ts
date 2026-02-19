export interface AppData {
  trackId: number;
  artworkUrl512: string;
  trackName: string;
  genres: string[];
  screenshotUrls: string[];
  description: string;
  averageUserRating: number;
  userRatingCount: number;
}

export interface SearchResult {
  resultCount: number;
  results: AppData[];
}

export async function searchApps(term: string): Promise<SearchResult> {
  // Use 'software' entity to search for apps
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}&entity=software&limit=30&country=KR`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data from iTunes API");
  }

  const data = await response.json();
  return data;
}
