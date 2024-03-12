import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tailwindcss from "tailwindcss";
import { readdirSync } from "fs";
import preserveDirectives from "rollup-plugin-preserve-directives";

const componentsDir = resolve(__dirname, "src/components");

const getFiles = (dir: string): string[] => {
  const dirents = readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
};

const components = getFiles(componentsDir);

const entry = components.reduce(
  (entries, componentPath) => {
    const key = componentPath
      .replace(componentsDir, "components")
      .replace(".tsx", "")
      .replace(".ts", "")
    return { ...entries, [key]: componentPath };
  },
  {
    index: resolve(__dirname, "src/index.ts"),
  }
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    preserveDirectives(), // NOTE: Preserves directives like "use client" at the top of files
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    lib: {
      entry,
      formats: ["es"],
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      output: {
        preserveModules: true, // NOTE: Turned on to make 'preserveModules' work properly
      },
    },
    copyPublicDir: false,
  },
});
