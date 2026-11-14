import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  const skipEsbuild = Boolean(process.env.VITE_SKIP_MINIFY);

  return {
    base: "./",
    esbuild: skipEsbuild ? false : undefined,
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(root, "index.html"),
          archive: path.resolve(root, "archive.html")
        }
      },
      ...(skipEsbuild ? { minify: false, cssMinify: false } : {})
    }
  };
});
