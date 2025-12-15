export interface GitHubLanguage {
  name: string;
}

export interface GitHubTopic {
  topic: {
    name: string;
  };
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  url: string;
  homepageUrl?: string | null;
  watchers: {
    totalCount: number;
  };
  languages: {
    nodes: GitHubLanguage[];
  };
  repositoryTopics: {
    nodes: GitHubTopic[];
  };
}
