import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // EN
      { source: '/en/what-is', destination: '/en/blog/what-is-da-siu-yan', permanent: true },
      { source: '/en/how-it-works', destination: '/en/blog/how-to-curse-someone', permanent: true },
      { source: '/en/history', destination: '/en/blog/history-of-villain-hitting', permanent: true },
      // ZH-TW
      { source: '/zh-TW/what-is', destination: '/zh-TW/blog/what-is-da-siu-yan', permanent: true },
      { source: '/zh-TW/how-it-works', destination: '/zh-TW/blog/how-to-curse-someone', permanent: true },
      { source: '/zh-TW/history', destination: '/zh-TW/blog/history-of-villain-hitting', permanent: true },
      // ZH-Hans
      { source: '/zh-Hans/what-is', destination: '/zh-Hans/blog/what-is-da-siu-yan', permanent: true },
      { source: '/zh-Hans/how-it-works', destination: '/zh-Hans/blog/how-to-curse-someone', permanent: true },
      { source: '/zh-Hans/history', destination: '/zh-Hans/blog/history-of-villain-hitting', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
