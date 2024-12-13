import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import TokenInput from "~~/components/TokenInput";
import { SUPPORTED_SYMBOLS } from "~~/config/configs";

describe("TokenInput", () => {
  const defaultProps = {
    token: SUPPORTED_SYMBOLS[0], // "rETH"
    amount: "",
    onAmountChange: vi.fn(),
    balance: 1.234,
    onMaxClick: vi.fn(),
    usdValue: "$1,234.56",
  };

  test("renders with default props", () => {
    const { container } = render(<TokenInput {...defaultProps} />);

    // Check if token symbol is displayed
    expect(container.textContent).includes("rETH");

    // Check if balance is displayed correctly
    expect(container.textContent).includes("Balance: 1.23");

    // Check if USD value is displayed
    expect(container.textContent).includes("$1,234.56");

    // Check if MAX button is present
    const maxButton = container.querySelector("button");
    expect(maxButton?.textContent).toBe("MAX");
  });

  test("handles valid number inputs", () => {
    const onAmountChange = vi.fn();
    const { container } = render(<TokenInput {...defaultProps} onAmountChange={onAmountChange} />);

    const input = container.querySelector("input");
    expect(input).toBeDefined();

    // Test valid inputs
    const validInputs = ["123", "123.456", "0.1", ".1"];
    validInputs.forEach(value => {
      fireEvent.change(input!, { target: { value } });
      expect(onAmountChange).toHaveBeenCalled();
    });
  });

  test("restricts invalid number inputs", () => {
    const onAmountChange = vi.fn();
    const { container } = render(<TokenInput {...defaultProps} onAmountChange={onAmountChange} />);

    const input = container.querySelector("input");
    expect(input).toBeDefined();

    // Test invalid inputs
    const invalidInputs = ["abc", "1e5", "1.2.3", "-1"];
    invalidInputs.forEach(value => {
      fireEvent.change(input!, { target: { value } });
      expect(onAmountChange).not.toHaveBeenCalledWith(
        expect.objectContaining({
          target: { value },
        }),
      );
    });
  });

  test("handles max length restriction", () => {
    const onAmountChange = vi.fn();
    const { container } = render(<TokenInput {...defaultProps} onAmountChange={onAmountChange} />);

    const input = container.querySelector("input");
    expect(input).toBeDefined();

    // Test number longer than 20 digits
    const longNumber = "12345678901234567890123";
    fireEvent.change(input!, { target: { value: longNumber } });
    expect(onAmountChange).not.toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: longNumber },
      }),
    );
  });

  test("handles MAX button click", () => {
    const onMaxClick = vi.fn();
    const { container } = render(<TokenInput {...defaultProps} onMaxClick={onMaxClick} />);

    const maxButton = container.querySelector("button");
    expect(maxButton).toBeDefined();

    fireEvent.click(maxButton!);
    expect(onMaxClick).toHaveBeenCalledOnce();
  });

  test("shows error state correctly", () => {
    const { container } = render(<TokenInput {...defaultProps} isError={true} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).includes("border-red-500");
  });

  test("disables input when loading", () => {
    const { container } = render(<TokenInput {...defaultProps} isLoading={true} />);

    const input = container.querySelector("input");
    const maxButton = container.querySelector("button");

    expect(input).toHaveProperty("disabled", true);
    expect(maxButton).toHaveProperty("disabled", true);
  });

  test("renders with WETH token", () => {
    const { container } = render(
      <TokenInput {...defaultProps} token={SUPPORTED_SYMBOLS[1]} />, // "WETH"
    );

    expect(container.textContent).includes("WETH");
  });

  test("handles placeholder state", () => {
    const { container } = render(<TokenInput {...defaultProps} amount="" />);

    const input = container.querySelector("input");
    expect(input?.getAttribute("placeholder")).toBe("0.00");
  });
});
