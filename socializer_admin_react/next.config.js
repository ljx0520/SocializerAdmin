/** @type {import('next').NextConfig} */
const nextBuildId = require('next-build-id');
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        outputStandalone: true,
    },
    // output: 'standalone',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    generateBuildId: () => nextBuildId({dir: __dirname})
    // swcMinify: true,
}

module.exports = nextConfig
