import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trello Clone PWA",
    short_name: "Trello_clone_pwa",
    description: "A Progressive Web App built with Next.js for Trello Clone",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/trello-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/vercel.svg",
        sizes: "512x512",
        type: "image/svg",
      },
      {
        src: "/default-avatar.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
