import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2022",
    shims: false,
    splitting: false,
  },
  {
    entry: {
      cli: "src/cli.ts",
    },
    format: ["cjs"],
    dts: false,
    sourcemap: true,
    clean: false,
    target: "es2022",
    shims: false,
    splitting: false,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
