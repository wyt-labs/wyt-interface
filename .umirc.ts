import { defineConfig } from 'umi';
import webpack from 'webpack';

export default defineConfig({
  nodeModulesTransform: {
    type: 'all',
    exclude: ['@umijs/preset-built-in'],
  },
  theme: {
    '@primary-color': '#5AC5DD',
  },
  publicPath: '/',
  proxy: {
    '/rpc': {
      // target: 'https://www.okx.com/',
      target:
        'https://rapidities-ignobleness-lzasmdnalw-dedicated.helius-rpc.com?api-key=d57e523a-d5f1-4b2d-839d-e537f676db7a',
      changeOrigin: true,
      pathRewrite: {
        '^/rpc': '',
      },
    },
    '/api/v1': {
      // target: 'https://www.okx.com/',
      target: 'http://94.74.111.72/gs',
      changeOrigin: true,
    },
    '/api': {
      target: 'https://prod.web.wyt.pagepreview.dev',
      changeOrigin: true,
    },
  },
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/chat/index',
      routes: [
        { exact: true, path: './', redirect: './chat' },
        { exact: true, path: './chat', component: '@/pages/Chat' },
        {
          exact: true,
          path: './uniswap-chat',
          component: '@/pages/Chat/uniswap',
        },
        { exact: true, path: './chat-agent', component: '@/pages/Chat/agent' },
      ],
    },
  ],
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
  fastRefresh: {},
  locale: {
    default: 'en-US',
  },
  extraBabelPlugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
  ],
  // Add webpack configuration
  webpack5: {},
  chainWebpack: (config) => {
    // Add polyfills
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        Buffer: ['buffer', 'Buffer'],
        process: require.resolve('process/browser'),
      },
    ]);

    // Configure module resolution
    config.merge({
      resolve: {
        alias: {
          buffer: require.resolve('buffer/'),
          process: require.resolve('process/browser.js'),
        },
        fallback: {
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve('crypto-browserify'),
          events: require.resolve('events/'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify/browser'),
          path: require.resolve('path-browserify'),
          fs: false,
          net: false,
          tls: false,
        },
      },
    });

    // Add a new rule for handling .mjs files
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
  },
});
