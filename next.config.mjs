/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // No external edgestore domains configured
        domains: [],
    },
    output: 'standalone',
};

export default nextConfig;