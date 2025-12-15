import type { GitHubRepository } from "types/github";

const GITHUB_API = "https://api.github.com/graphql";

const token = import.meta.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN no está definido");
}

async function graphqlRequest<T>(query: string): Promise<T> {
  const res = await fetch(GITHUB_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("GitHub GraphQL Error:", json.errors);
    throw new Error("GitHub GraphQL Error");
  }

  return json.data;
}

/* ---------------- QUERIES ---------------- */

export async function fetchPinnedRepos(): Promise<GitHubRepository[]> {
  const query = `
    query {
      viewer {
        pinnedItems(first: 3, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              forkCount
              url
              homepageUrl
              watchers { totalCount }
              languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
                nodes { name }
              }
              repositoryTopics(first: 5) {
                nodes { topic { name } }
              }
            }
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{
    viewer: {
      pinnedItems: { nodes: GitHubRepository[] };
    };
  }>(query);

  return data.viewer.pinnedItems.nodes;
}

export async function fetchPopularRepos(): Promise<GitHubRepository[]> {
  const query = `
    query {
      viewer {
        repositories(
          first: 3
          orderBy: {field: STARGAZERS, direction: DESC}
          privacy: PUBLIC
          isFork: false
        ) {
          nodes {
            name
            description
            stargazerCount
            forkCount
            url
            homepageUrl
            watchers { totalCount }
            languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
              nodes { name }
            }
            repositoryTopics(first: 5) {
              nodes { topic { name } }
            }
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{
    viewer: {
      repositories: { nodes: GitHubRepository[] };
    };
  }>(query);

  return data.viewer.repositories.nodes;
}

export async function fetchCreatedRepos(): Promise<GitHubRepository[]> {
  const query = `
    query {
      viewer {
        repositories(
          first: 3
          orderBy: {field: CREATED_AT, direction: DESC}
          privacy: PUBLIC
          isFork: false
        ) {
          nodes {
            name
            description
            stargazerCount
            forkCount
            url
            homepageUrl
            watchers { totalCount }
            languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
              nodes { name }
            }
            repositoryTopics(first: 5) {
              nodes { topic { name } }
            }
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{
    viewer: {
      repositories: { nodes: GitHubRepository[] };
    };
  }>(query);

  return data.viewer.repositories.nodes;
}

export async function fetchMostWatchedRepos(): Promise<GitHubRepository[]> {
  const query = `
    query {
      viewer {
        repositories(
          first: 5
          privacy: PUBLIC
          isFork: false
        ) {
          nodes {
            name
            description
            stargazerCount
            forkCount
            url
            watchers { totalCount }
            languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
              nodes { name }
            }
            repositoryTopics(first: 5) {
              nodes { topic { name } }
            }
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{
    viewer: {
      repositories: { nodes: GitHubRepository[] };
    };
  }>(query);

  return data.viewer.repositories.nodes
    .sort((a, b) => b.watchers.totalCount - a.watchers.totalCount)
    .slice(0, 3);
}
