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
      // ZH-TW short URLs → new ZH-native posts
      { source: '/zh-TW/what-is', destination: '/zh-TW/blog/打小人完整攻略', permanent: true },
      { source: '/zh-TW/how-it-works', destination: '/zh-TW/blog/打小人完整攻略', permanent: true },
      { source: '/zh-TW/history', destination: '/zh-TW/blog/打小人的歷史', permanent: true },
      // ZH-TW old EN-slug posts → new ZH-native posts
      { source: '/zh-TW/blog/what-is-da-siu-yan', destination: '/zh-TW/blog/打小人完整攻略', permanent: true },
      { source: '/zh-TW/blog/how-to-curse-someone', destination: '/zh-TW/blog/打小人完整攻略', permanent: true },
      { source: '/zh-TW/blog/history-of-villain-hitting', destination: '/zh-TW/blog/打小人的歷史', permanent: true },
      // ZH-Hans short URLs → new ZH-native posts
      { source: '/zh-Hans/what-is', destination: '/zh-Hans/blog/打小人完整攻略', permanent: true },
      { source: '/zh-Hans/how-it-works', destination: '/zh-Hans/blog/打小人完整攻略', permanent: true },
      { source: '/zh-Hans/history', destination: '/zh-Hans/blog/打小人的歷史', permanent: true },
      // ZH-Hans old EN-slug posts → new ZH-native posts
      { source: '/zh-Hans/blog/what-is-da-siu-yan', destination: '/zh-Hans/blog/打小人完整攻略', permanent: true },
      { source: '/zh-Hans/blog/how-to-curse-someone', destination: '/zh-Hans/blog/打小人完整攻略', permanent: true },
      { source: '/zh-Hans/blog/history-of-villain-hitting', destination: '/zh-Hans/blog/打小人的歷史', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
