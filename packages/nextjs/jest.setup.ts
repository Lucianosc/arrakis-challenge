import React from "react";
import "@testing-library/jest-dom";

// Add TextEncoder/TextDecoder mock
class TextEncoderMock {
  encode(str: string): Uint8Array {
    return new Uint8Array([...str].map(char => char.charCodeAt(0)));
  }
}

class TextDecoderMock {
  decode(array: Uint8Array): string {
    return String.fromCharCode(...array);
  }
}

global.TextEncoder = TextEncoderMock as any;
global.TextDecoder = TextDecoderMock as any;

// Add BigInt serialization support
expect.extend({
  toBeBigInt(received, expected) {
    const pass = received === expected;
    return {
      pass,
      message: () => `expected ${received.toString()} ${pass ? "not to be" : "to be"} ${expected.toString()}`,
    };
  },
});

// Add BigInt serialization
if (!global.BigInt.prototype.hasOwnProperty("toJSON")) {
  Object.defineProperty(BigInt.prototype, "toJSON", {
    value: function () {
      return this.toString();
    },
  });
}

// Mock Web3Icons
jest.mock("@web3icons/react", () => ({
  TokenIcon: () => React.createElement("div", { "data-testid": "token-icon" }),
}));

// Mock Wagmi hooks
jest.mock("wagmi", () => ({
  useAccount: jest.fn(),
  useSwitchChain: jest.fn(),
  useBalance: jest.fn(() => ({
    data: { formatted: "1.0", symbol: "ETH" },
    isLoading: false,
    isError: false,
  })),
  useContractRead: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
  })),
  useContractWrite: jest.fn(() => ({
    writeAsync: jest.fn(),
    isLoading: false,
    isError: false,
  })),
}));

// Mock RainbowKit
jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => React.createElement("div", null),
  useConnectModal: jest.fn(() => ({
    openConnectModal: jest.fn(),
  })),
}));

// Mock custom hooks
jest.mock("~~/hooks/useTokenPrice", () => ({
  useTokenPrice: jest.fn(() => ({
    price: 2000,
    isError: false,
    isLoading: false,
    lastUpdate: new Date(),
  })),
}));

jest.mock("~~/hooks/useTokensPairState", () => ({
  useTokensPairState: jest.fn(),
}));

jest.mock("~~/hooks/useVaultRatio", () => ({
  useVaultRatio: jest.fn(() => 1),
}));
