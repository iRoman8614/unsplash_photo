/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com'],
        unoptimized: true,
    },
    //basePath: '/unsplash_photo',
    //assetPrefix: '/unsplash_photo/',
    trailingSlash: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default nextConfig;
