import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
    },
    environment: "jsdom",
    exclude: [
      "**/.{idea,git,cache,output,temp}/**",
      "**/cypress/**",
      "**/dist/**",
      "**/node_modules/**",
      "./test/pages/**",
    ],
    globals: true,
    setupFiles: "./__tests__/setup.ts",
  },
});
