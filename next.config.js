module.exports = {
  experimental: {
    cpus: 2
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com'
      }
    ]
  },
  eslint: {
    dirs: [
      'components',
      'layouts',
      'lib',
      'pages'
    ]
  },
  async headers () {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          }
        ]
      }
    ]
  }
}
