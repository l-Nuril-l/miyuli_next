const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5284',
                pathname: '/api/**',
            },
            {
                protocol: 'https',
                hostname: 'localhost',
                port: '7284',
                pathname: '/api/**',
            },
            {
                protocol: 'https',
                hostname: 'miyuli.uk',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'miyulibackend.pp.ua',
                port: '',
                pathname: '**',
            },
        ],
    },
    reactStrictMode: false,
    sassOptions: {
        includePaths: [path.join(__dirname)],
    },
    experimental: {
        turbo: {
            rules: {
                "*.scss": {
                    loaders: ["sass-loader"],
                    as: "*.css",
                },
            },
        }
    }
};

module.exports = withNextIntl(nextConfig);