/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,  
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'dev' ? '' : '',
};

export default nextConfig;
