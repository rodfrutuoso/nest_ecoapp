import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigParh from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    setupFiles: ["./test/setup-e2e.ts"],
    testTimeout: 20000
    // poolOptions: {
    //   threads: {
    //     singleThread: true,
    //   },
    // },
  },
  plugins: [
    tsConfigParh(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
