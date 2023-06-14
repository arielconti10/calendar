/** @type {import('next').NextConfig} */
import dns from 'dns'
dns.setDefaultResultOrder("ipv4first")

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
    ],
  }
}

export default nextConfig
