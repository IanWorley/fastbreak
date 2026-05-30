import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
            },
            {
              name: "clerk-vendor",
              test: /node_modules[\\/]@clerk[\\/]/,
              priority: 30,
              maxSize: 250 * 1024,
            },
            {
              name: "tanstack-vendor",
              test: /node_modules[\\/]@tanstack[\\/]/,
              priority: 20,
              maxSize: 250 * 1024,
            },
            {
              name: "trpc-vendor",
              test: /node_modules[\\/](@trpc|superjson)[\\/]/,
              priority: 20,
            },
            {
              name: "ui-vendor",
              test: /node_modules[\\/](@radix-ui|next-themes|react-icons|sonner|vaul)[\\/]/,
              priority: 10,
            },
            {
              name: "vendor",
              test: /node_modules[\\/]/,
              maxSize: 250 * 1024,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
