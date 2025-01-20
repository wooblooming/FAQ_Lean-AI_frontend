/** @type {import('next').NextConfig} */

import fs from 'fs';

const nextConfig = {
  reactStrictMode: false,  
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'dev' ? '' : '',

};

export default nextConfig;
