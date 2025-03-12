import { useQuery } from '@tanstack/react-query';
import { getRssFeed } from '@/lib/rss';

const REFRESH_INTERVAL = 1000 * 60 * 60; // 60 minutes

export function useRssFeed() {
  // const isLocal = window.location.hostname === 'localhost';
  const url = '/api';
  return useQuery({
    queryKey: ['rss-feed', url],
    queryFn: () => getRssFeed(url),
    refetchInterval: REFRESH_INTERVAL,
  });
}
