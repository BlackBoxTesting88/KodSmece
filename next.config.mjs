const staticExport = process.env.STATIC_EXPORT === 'true';
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const config = {
  trailingSlash: true,
  ...(staticExport ? { output: 'export', basePath } : {
    async rewrites() {
      // Existing local-preview tabs use this address after a server restart.
      return process.env.NODE_ENV === 'development'
        ? [{ source: '/__dev/session/', destination: '/api/dev-session/' }]
        : [];
    },
  }),
};

export default config;
