// lib/githubGraphQL.js

export async function fetchPinnedRepos() {
  const token = import.meta.env.GITHUB_TOKEN;

  const query = `
query {
  viewer {
    login
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          stargazerCount
          forkCount
          url
          homepageUrl
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

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Errores de GraphQL:", json.errors);
    return [];
  }

  return json.data?.viewer?.pinnedItems?.nodes || [];
}

export async function fetchPopularRepos() {
  const token = import.meta.env.GITHUB_TOKEN;

  const query = `
query {
  viewer {
    login
    repositories(
      first: 6
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
        watchers {
          totalCount
        }
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

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Errores de GraphQL:", json.errors);
    return [];
  }

  return json.data?.viewer?.repositories?.nodes || [];
}

export async function fetchCreatedRepos() {
  const token = import.meta.env.GITHUB_TOKEN;

  const query = `
query {
  viewer {
    login
    repositories(
      first: 6
      orderBy: {field: CREATED_AT, direction: DESC}
      privacy: PUBLIC
      isFork: false
    ) {
      nodes {
        name
        description
        stargazerCount
        forkCount
        watchers {
          totalCount
        }
        url
        homepageUrl
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

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Errores de GraphQL:", json.errors);
    return [];
  }

  return json.data?.viewer?.repositories?.nodes || [];
}

export async function fetchMostWatchedRepos() {
  const token = import.meta.env.GITHUB_TOKEN;

  const query = `
query {
  viewer {
    login
    repositories(
      first: 6
      orderBy: {field: UPDATED_AT, direction: DESC}
      privacy: PUBLIC
      isFork: false
    ) {
      nodes {
        name
        description
        stargazerCount
        forkCount
        watchers {
          totalCount
        }
        url
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

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Errores de GraphQL:", json.errors);
    return [];
  }

  // Ordenar por watchers
  const repos = json.data?.viewer?.repositories?.nodes || [];
  return repos.sort((a, b) => b.watchers.totalCount - a.watchers.totalCount);
}
