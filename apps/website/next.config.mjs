const proxyUrl = process.env.PROXY_URL || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/app/:match*",
        destination: `${proxyUrl}/app/:match*`,
      },
    ];
  },
};

export default nextConfig;
