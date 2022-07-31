/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/socializer/portal',
    reactStrictMode: true,
    experimental: {
        outputStandalone: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        backendUrl: '/socializer/portal',
    },
}

module.exports = nextConfig
