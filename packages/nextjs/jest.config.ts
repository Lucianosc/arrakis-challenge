import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  // Coverage configuration
  collectCoverage: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!<rootDir>/out/**",
    "!<rootDir>/.next/**",
    "!<rootDir>/*.config.js",
    "!<rootDir>/coverage/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Test environment configuration
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Module mapping
  moduleNameMapper: {
    // Handle CSS imports
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$": "<rootDir>/__mocks__/fileMock.js",

    // Handle module aliases
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/hooks/(.*)$": "<rootDir>/hooks/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^~~/(.*)$": "<rootDir>/$1",

    // Handle Next.js specific imports
    "@next/font/(.*)": "<rootDir>/__mocks__/nextFontMock.js",
    "next/font/(.*)": "<rootDir>/__mocks__/nextFontMock.js",
    "server-only": "<rootDir>/__mocks__/empty.js",

    // Handle Web3 modules
    "@rainbow-me/rainbowkit": "<rootDir>/node_modules/@rainbow-me/rainbowkit/dist/index.js",
    wagmi: "<rootDir>/node_modules/wagmi/dist/index.js",
  },

  // Transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // Ignore patterns
  transformIgnorePatterns: [
    "/node_modules/(?!(@web3icons|@rainbow-me|wagmi|viem)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],

  // Environment options
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

export default createJestConfig(config);
