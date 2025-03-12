import axios from 'axios';

export interface RSSItem {
  id: string;
  title: string;
  content: string;
  creation_time: string;
  pic: string;
  url: string;
}

export async function getRssFeed(url: string): Promise<RSSItem[]> {
  const response = await axios.get(url);
  return response.data;
}
