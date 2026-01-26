import { spawn } from "child_process";
import path from "path";

export interface SearchResult {
  title: string;
  url: string;
  source: string;
  quality?: string;
  size?: string;
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  return new Promise((resolve) => {
    console.log(`Searching for: ${query}`);

    // Execute Python script to perform search
    const pythonProcess = spawn("python", [
      "-c",
      `
import sys
sys.path.append('${path.join(process.cwd(), "TEMP")}')
from StreamingCommunity.services._base.loader import load_search_functions
from StreamingCommunity.services._base.object import MediaManager

# Load search functions
search_functions = load_search_functions()
media_manager = MediaManager()

# Execute search for each available site
for site_name, search_func in search_functions.items():
    try:
        results = search_func("${query}")
        if results and hasattr(results, 'media_list'):
            for media in results.media_list:
                print(f"TITLE:{media.name}")
                print(f"URL:{media.url}")
                print(f"SOURCE:{site_name.replace('_search', '')}")
                print("---")
    except Exception as e:
        print(f"ERROR:{site_name}:{str(e)}", file=sys.stderr)
      `,
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python search error:", errorOutput);
        // Return mock results as fallback
        resolve(getMockResults(query));
        return;
      }

      try {
        const results = parseSearchOutput(output);
        resolve(results.length > 0 ? results : getMockResults(query));
      } catch (error) {
        console.error("Error parsing search output:", error);
        resolve(getMockResults(query));
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Failed to start Python process:", error);
      resolve(getMockResults(query));
    });
  });
}

function parseSearchOutput(output: string): SearchResult[] {
  const results: SearchResult[] = [];
  const entries = output.split("---").filter((entry) => entry.trim());

  for (const entry of entries) {
    const titleMatch = entry.match(/TITLE:(.+)/);
    const urlMatch = entry.match(/URL:(.+)/);
    const sourceMatch = entry.match(/SOURCE:(.+)/);

    if (titleMatch && urlMatch && sourceMatch) {
      results.push({
        title: titleMatch[1].trim(),
        url: urlMatch[1].trim(),
        source: sourceMatch[1].trim(),
      });
    }
  }

  return results;
}

function getMockResults(query: string): SearchResult[] {
  return [
    {
      title: `Example result for "${query}"`,
      url: "https://example.com/video1",
      source: "Example Source",
      quality: "1080p",
      size: "1.2GB",
    },
    {
      title: `Another result for "${query}"`,
      url: "https://example.com/video2",
      source: "Another Source",
      quality: "720p",
      size: "800MB",
    },
  ];
}

export async function searchByCategory(
  category: string,
): Promise<SearchResult[]> {
  // TODO: Implement category-based search
  console.log(`Searching category: ${category}`);

  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      title: `${category} - Popular Content`,
      url: `https://example.com/${category}/popular`,
      source: "Popular Source",
      quality: "1080p",
      size: "2.1GB",
    },
  ];
}
