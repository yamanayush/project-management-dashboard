/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.discordapp.com']
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
