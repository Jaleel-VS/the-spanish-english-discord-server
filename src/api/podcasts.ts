import { queryOptions } from '@tanstack/react-query';

export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  language: 'en' | 'es' | 'both';
  level: 'beginner' | 'intermediate' | 'advanced';
  country: string;
  topic: string;
  url: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://spa-eng-discord-website-backend-production.up.railway.app/api';

async function fetchPodcasts(): Promise<Podcast[]> {
  const response = await fetch(`${API_BASE_URL}/podcasts`);
  if (!response.ok) {
    throw new Error('Failed to fetch podcasts');
  }
  return response.json();
}

async function fetchPodcastById(id: string): Promise<Podcast> {
  const response = await fetch(`${API_BASE_URL}/podcasts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch podcast');
  }
  return response.json();
}

export const podcastsQueryOptions = queryOptions({
  queryKey: ['podcasts'],
  queryFn: fetchPodcasts,
});

export const podcastQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['podcasts', id],
    queryFn: () => fetchPodcastById(id),
  });
