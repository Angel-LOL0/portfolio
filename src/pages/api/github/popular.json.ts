import type { APIRoute } from "astro";
import { fetchMostWatchedRepos } from "lib/githubGraphQL";

export const GET: APIRoute = async () => {
  try {
    const repos = await fetchMostWatchedRepos();

    return new Response(JSON.stringify(repos), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "GitHub API error" }), {
      status: 500,
    });
  }
};
