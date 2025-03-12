import { generateFromString } from 'generate-avatar';
export const DEFAULT_AVATAR_URL: string =
  'http://172.16.13.127:7070/api/v1/fs/files/avatar/4PvNcK3MX7y';
export const trackColorArray = [
  'bg-red-100 text-red-500',
  'bg-pink-100 text-pink-500',
  'bg-purple-100 text-purple-500',
  'bg-gray-100 text-gray-500',
  'bg-blue-100 text-blue-500',
  'bg-yellow-100 text-yellow-500',
  'bg-green-100 text-green-500',
];

export const getImgFromHash = (hash = '') =>
  `data:image/svg+xml;utf8,${generateFromString(hash)}`;
