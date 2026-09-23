/** @type {import('next').NextConfig} */
const nextConfig = {
  // lucide-react ships one module per icon but is imported from ~15 components;
  // this rewrites those imports to only pull the icons actually used instead of
  // the whole barrel file.
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  images: {
    // Hosts allowed through the image optimizer. When adding one here, add it to
    // OPTIMIZED_HOSTS in lib/images.ts as well — <SafeImage> uses that list to decide
    // whether a src can be optimized or must be rendered unoptimized.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "www.paypalobjects.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.gstatic.com" }
    ]
  }
};

export default nextConfig;
