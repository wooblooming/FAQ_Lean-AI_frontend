// next.config.js

/** @type {import('next').NextConfig} */

// import fs from 'fs'; // fs가 필요하다면 주석 해제

const nextConfig = {
  reactStrictMode: false,

  images: {
    unoptimized: true,
    // domains: ['mumulai.com'],  // 필요하다면 추가
  },
};

export default nextConfig;
