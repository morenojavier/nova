import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // MCP server solo en desarrollo (evita overhead en producción)
  experimental: {
    mcpServer: process.env.NODE_ENV === 'development',
  },
}

export default nextConfig
