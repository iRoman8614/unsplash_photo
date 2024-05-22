/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com'],
        unoptimized: trueб
    },
    basePath: '/unsplash_photo',
    assetPrefix: '/unsplash_photo/',
    trailingSlash: true,
    output: 'export',
};

export default nextConfig;
