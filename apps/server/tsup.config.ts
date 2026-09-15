import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  splitting: false,
  clean: true,
  noExternal: [/@kenku\/.*/], // бандлим все @kenku/* пакеты прямо внутрь
});
