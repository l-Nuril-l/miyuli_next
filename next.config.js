const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/id:slug(\\d+)', // Маршрут начинается с 'id' и за ним следует число
                destination: '/id/:slug', // Перенаправление на динамический маршрут
            },
            {
                source: '/albums:slug(\\d+)', // Маршрут начинается с 'id' и за ним следует число
                destination: '/albums/:slug', // Перенаправление на динамический маршрут
            },
            {
                source: '/audios:slug(\\d+)', // Маршрут начинается с 'id' и за ним следует число
                destination: '/audios/:slug', // Перенаправление на динамический маршрут
            },
        ];
    },
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
};

module.exports = withNextIntl(nextConfig);