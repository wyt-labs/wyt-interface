const { kv } = require('@vercel/kv');
const axios = require('axios');
const https = require('https');

const url =
  'https://api.theblockbeats.news/v1/open-api/open-flash?size=10&page=1&type=push&lang=en';
const key = 'news-cache';

async function GET(request: Request) {
  let data: any[] | null = [];
  let useCache = false;
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    // fetch data from the API
    const response = await axios.get(url, { httpsAgent: agent });
    data = response.data.data.data;
  } catch (error) {
    console.error('API request failed:', error);
    // if the API fails, try to get the data from the KV
    data = await kv.get(key);
    useCache = true;
  }

  if (!useCache) {
    // store the data in the KV
    await kv.set(key, data);
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
    },
  });
}

module.exports = { GET };
