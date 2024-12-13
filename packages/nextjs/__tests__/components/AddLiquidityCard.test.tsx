import { ChangeEvent } from "react";
import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AddLiquidityCard, AddLiquidityCardProps } from "~~/components/AddLiquidityCard";
import { TOKENS } from "~~/config/configs";
import { TokenState } from "~~/hooks/useTokensPairState";

// Mock web3icons/react
vi.mock("@web3icons/react", () => ({
  TokenIcon: ({ symbol }: { symbol: string }) => <div>Token Icon: {symbol}</div>,
}));

describe("AddLiquidityCard", () => {
  const mockTokens: TokenState = [
    {
      ...TOKENS.WETH,
      amount: "1.0",
      balance: 2.5,
      usdValue: "$3,000.00",
      isError: false,
    },
    {
      ...TOKENS.rETH,
      amount: "0.5",
      balance: 1.5,
      usdValue: "$3,400.00",
      isError: false,
    },
  ];

  const defaultProps: AddLiquidityCardProps = {
    tokens: mockTokens,
    onAmountChange: vi.fn(() => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numberValue = Number(value);
      return numberValue;
    }),
    onMaxClick: () => vi.fn(),
    errorMsg: "",
    buttonState: {
      text: "Add Liquidity",
      action: vi.fn(),
      disabled: false,
    },
  };

  test("renders card header with token pair", () => {
    const { getByText } = render(<AddLiquidityCard {...defaultProps} />);

    expect(getByText("Add liquidity")).toBeDefined();
    expect(getByText("WETH/rETH")).toBeDefined();
    expect(getByText("Token Icon: eth")).toBeDefined();
    expect(getByText("Token Icon: rpl")).toBeDefined();
  });

  test("renders both token inputs", () => {
    const { getAllByPlaceholderText, container } = render(<AddLiquidityCard {...defaultProps} />);

    // Check token symbols
    const wethLabels = container.querySelectorAll("div");
    const wethLabel = Array.from(wethLabels).find(label => label.textContent === "WETH");
    expect(wethLabel).toBeDefined();

    const rEthLabels = container.querySelectorAll("div");
    const rEthLabel = Array.from(rEthLabels).find(label => label.textContent === "rETH");
    expect(rEthLabel).toBeDefined();

    // Check input fields
    const inputs = getAllByPlaceholderText("0.00");
    expect(inputs).toHaveLength(2);
  });

  test("renders token balances and USD values", () => {
    const { container } = render(<AddLiquidityCard {...defaultProps} />);

    const balanceMatcher = (content: string) => {
      if (typeof content !== "string") {
        return false;
      }
      return content.startsWith("Balance:");
    };

    const balanceElements = Array.from(container.querySelectorAll("span")).filter(span =>
      balanceMatcher(span.textContent || ""),
    );
    expect(balanceElements).toHaveLength(2);

    const dollarMatcher = (content: string) => {
      if (typeof content !== "string") {
        return false;
      }
      return content.startsWith("$");
    };

    const dollarElements = Array.from(container.querySelectorAll("span")).filter(span =>
      dollarMatcher(span.textContent || ""),
    );
    expect(dollarElements).toHaveLength(2);
  });

  test("renders add liquidity button with correct state", () => {
    const { container } = render(<AddLiquidityCard {...defaultProps} />);
    const buttons = container.querySelectorAll("button");
    // Filter out the MAX buttons
    const liquidityButtons = Array.from(buttons).filter(button => button.textContent === "Add Liquidity");
    expect(liquidityButtons).toHaveLength(1);

    expect(liquidityButtons[0].getAttribute("disabled")).toBeNull();
  });

  test("renders disabled button when specified", () => {
    const props = {
      ...defaultProps,
      buttonState: {
        ...defaultProps.buttonState,
        disabled: true,
      },
    };
    const { container } = render(<AddLiquidityCard {...props} />);
    const buttons = container.querySelectorAll("button");
    // Filter out the MAX buttons
    const liquidityButtons = Array.from(buttons).filter(button => button.textContent === "Add Liquidity");
    expect(liquidityButtons[0].getAttribute("disabled")).toBe("");
  });

  test("displays error message when provided", () => {
    const errorMsg = "Insufficient balance";
    const props = {
      ...defaultProps,
      errorMsg,
    };

    const { getByText } = render(<AddLiquidityCard {...props} />);
    expect(getByText(errorMsg)).toBeDefined();
  });

  test("renders token inputs with error state", () => {
    const tokensWithError = [{ ...mockTokens[0], isError: true }, { ...mockTokens[1] }] as const;

    const props = {
      ...defaultProps,
      tokens: tokensWithError,
    };

    const { container } = render(<AddLiquidityCard {...props} />);
    const errorInput = container.querySelector(".border-red-500");
    expect(errorInput).toBeDefined();
  });

  test("renders slippage settings", () => {
    const { container } = render(<AddLiquidityCard {...defaultProps} />);
    const slippageLabels = container.querySelectorAll("p");
    const slippageLabel = Array.from(slippageLabels).find(label => label.textContent === "Slippage");
    expect(slippageLabel).toBeDefined();

    const slippageAmount = Array.from(slippageLabels).find(label => label.textContent === "0.5%");
    expect(slippageAmount).toBeDefined();
  });

  test("applies correct styling classes", () => {
    const { container } = render(<AddLiquidityCard {...defaultProps} />);

    const card = container.querySelector(".bg-neutral-900");
    expect(card).toBeDefined();
    expect(card?.className).includes("border-amber-900/20");

    const button = container.querySelector(".bg-amber-600");
    expect(button).toBeDefined();
    expect(button?.className).includes("hover:bg-amber-700");
  });
});
