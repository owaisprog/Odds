import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.unsplash.com" },
      // Add these two:
      { protocol: "https", hostname: "unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  transpilePackages: ["@workspace/ui"],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;

const authors = [
  {
    authorName: "DeWitt Burnham",
    authorImage:
      "https://res.cloudinary.com/dmlemjrcg/image/upload/v1765785790/photo-1761957361067-6ca9101c82e4_qyhfhc.avif",
  },
  {
    authorName: "Rocco W. Harris",
    authorImage:
      "https://res.cloudinary.com/dmlemjrcg/image/upload/v1765785844/vitaly-gariev-0CGUB3Gtzxk-unsplash_gpoiw1.jpg",
  },
  {
    authorName: "Steven Barnes",
    //remaining
    authorImage:
      "https://res.cloudinary.com/dmlemjrcg/image/upload/v1765786136/linkedin-sales-solutions-pAtA8xe_iVM-unsplash_ige7gz.jpg",
  },
  {
    authorName: "Robbie Barker",
    authorImage:
      "https://res.cloudinary.com/dmlemjrcg/image/upload/v1765785949/m_pxio-gCC6T5pmo1A-unsplash_olv54f.jpg",
  },
  {
    authorName: "Timothy M. Johnson",
    authorImage:
      "https://res.cloudinary.com/dmlemjrcg/image/upload/v1765785997/vitaly-gariev-GubVKw7cfuY-unsplash_mux5m8.jpg",
  },
  {
    authorName: "Rocco W. Harris",
    authorImage:
      "https://res.cloudinary.com/dmlemjrcg/image/upload/v1765786070/david-mumma-aChQUTPMhkI-unsplash_j4r0cr.jpg",
  },
];
