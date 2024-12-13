import { fireEvent, render, screen } from "@testing-library/react";
import { AddLiquidityCard } from "~~/components/AddLiquidityCard";
import { VAULT_CONFIG } from "~~/config/configs";
import { TokenState } from "~~/hooks/useTokensPairState";

// Mock the TokenIcon component
jest.mock("@web3icons/react", () => ({
  TokenIcon: () => <div data-testid="token-icon" />,
}));

// Mock the Settings2 icon
jest.mock("lucide-react", () => ({
  Settings2: () => <div data-testid="settings-icon" />,
}));

describe("AddLiquidityCard", () => {
  // Track input values in test state
  let inputValues = {
    0: "1.0",
    1: "1.0",
  };

  // Common test props based on actual token configurations
  const mockTokens: TokenState = {
    0: {
      ...VAULT_CONFIG.token0,
      amount: inputValues[0],
      balance: 10,
      usdValue: "2000",
      isError: false,
    },
    1: {
      ...VAULT_CONFIG.token1,
      amount: inputValues[1],
      balance: 5,
      usdValue: "2200",
      isError: false,
    },
  };

  const mockOnAmountChange = (tokenIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only accept valid numeric input
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      inputValues[tokenIndex as keyof typeof inputValues] = value;
      return value;
    }
    return inputValues[tokenIndex as keyof typeof inputValues];
  };

  const mockOnMaxClick = (tokenIndex: number) => () => {
    const maxAmount = tokenIndex === 0 ? "10" : "5";
    inputValues[tokenIndex as keyof typeof inputValues] = maxAmount;
    return maxAmount;
  };

  const defaultProps = {
    tokens: mockTokens,
    onAmountChange: jest.fn(mockOnAmountChange),
    onMaxClick: jest.fn(mockOnMaxClick),
    errorMsg: "",
    buttonState: {
      text: "Add Liquidity",
      action: () => {},
      disabled: false,
    },
  };

  beforeEach(() => {
    // Reset input values before each test
    inputValues = { 0: "1.0", 1: "1.0" };
    defaultProps.onAmountChange.mockClear();
    defaultProps.onMaxClick.mockClear();
  });

  it("renders the component with correct header content", () => {
    render(<AddLiquidityCard {...defaultProps} />);

    expect(screen.getByText("Add liquidity")).toBeInTheDocument();
    expect(screen.getByText("WETH/rETH")).toBeInTheDocument();
    expect(screen.getAllByTestId("token-icon")).toHaveLength(2);
  });

  it("renders both token input fields with correct token information", () => {
    render(<AddLiquidityCard {...defaultProps} />);

    // Check if both token symbols are rendered
    expect(screen.getByText("WETH")).toBeInTheDocument();
    expect(screen.getByText("rETH")).toBeInTheDocument();

    // Check if balances are rendered - using partial text match
    expect(screen.getByText(/Balance: 10\.0/)).toBeInTheDocument();
    expect(screen.getByText(/Balance: 5\.00/)).toBeInTheDocument();

    // Check if USD values are rendered
    expect(screen.getByText("2000")).toBeInTheDocument();
    expect(screen.getByText("2200")).toBeInTheDocument();
  });

  it("handles amount changes correctly", () => {
    render(<AddLiquidityCard {...defaultProps} />);

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "2.0" } });

    expect(defaultProps.onAmountChange).toHaveBeenCalled();
    expect(inputValues[0]).toBe("2.0");
  });

  it("handles max button clicks", () => {
    render(<AddLiquidityCard {...defaultProps} />);

    const maxButtons = screen.getAllByText("MAX");
    fireEvent.click(maxButtons[0]);

    expect(defaultProps.onMaxClick).toHaveBeenCalled();
    expect(inputValues[0]).toBe("10");
  });

  it("displays error message when provided", () => {
    const errorProps = {
      ...defaultProps,
      errorMsg: "Insufficient balance",
    };

    render(<AddLiquidityCard {...errorProps} />);
    expect(screen.getByText("Insufficient balance")).toBeInTheDocument();
  });

  it("handles disabled button state", () => {
    const disabledProps = {
      ...defaultProps,
      buttonState: {
        text: "Insufficient Balance",
        disabled: true,
        action: jest.fn(),
      },
    };

    render(<AddLiquidityCard {...disabledProps} />);
    const button = screen.getByRole("button", { name: "Insufficient Balance" });

    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(disabledProps.buttonState.action).not.toHaveBeenCalled();
  });
});
