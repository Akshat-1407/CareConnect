/** @type {import('next').NextConfig} */
const nextConfig = {
  // On Vercel build servers, allow normal multi-threaded builds.
  // In constrained local Windows environments, limit CPUs to prevent OOM.
  ...(process.env.VERCEL
    ? {}
    : {
        experimental: {
          workerThreads: false,
          cpus: 1,
        },
      }),
};

export default nextConfig;
