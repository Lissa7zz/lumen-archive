import { defineConfig } from "vite";

export default defineConfig(() => {
  const skipEsbuild = Boolean(process.env.VITE_SKIP_MINIFY);

  return {
    base: "./",
    esbuild: skipEsbuild ? false : undefined,
    build: skipEsbuild ? { minify: false, cssMinify: false } : undefined
  };
});
