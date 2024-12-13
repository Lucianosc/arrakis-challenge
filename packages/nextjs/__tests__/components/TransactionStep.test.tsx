import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TransactionStep } from "~~/components/TransactionStep";

describe("TransactionStep", () => {
  const defaultProps = {
    id: 0,
    title: "Approve Token",
    status: "idle" as const,
    confirmations: 0,
    requiredConfirmations: 3,
  };

  const mockTxHash = "0x123456789abcdef";

  test("renders idle state correctly", () => {
    const { container } = render(<TransactionStep {...defaultProps} />);

    expect(container.textContent).includes("Approve Token");
    expect(container.textContent).includes("1"); // id + 1
    expect(container.querySelector(".border-amber-500")).toBeDefined();
  });

  test("renders pending state with correct message", () => {
    const { container } = render(<TransactionStep {...defaultProps} status="pending" />);

    expect(container.textContent).includes("Please sign the transaction in your wallet");
    expect(container.querySelector(".text-blue-500")).toBeDefined();
  });

  test("renders waiting state with confirmations", () => {
    const { container } = render(
      <TransactionStep {...defaultProps} status="waiting" confirmations={1} txHash={mockTxHash} />,
    );

    expect(container.textContent).includes("Waiting for confirmations (1/3)");
    expect(container.textContent).includes("View on Arbiscan");
    expect(container.querySelector(".animate-spin")).toBeDefined();
  });

  test("renders success state with transaction link", () => {
    const { container } = render(<TransactionStep {...defaultProps} status="success" txHash={mockTxHash} />);

    const link = container.querySelector("a");
    expect(link).toBeDefined();
    expect(link?.href).toBe(`https://arbiscan.io/tx/${mockTxHash}`);
    expect(link?.target).toBe("_blank");
    expect(link?.rel).includes("noopener");
    expect(container.querySelector(".text-green-500")).toBeDefined();
  });

  test("renders error state with error message", () => {
    const errorMessage = "Transaction rejected";
    const { container } = render(<TransactionStep {...defaultProps} status="error" error={errorMessage} />);

    expect(container.textContent).includes(errorMessage);
    expect(container.querySelector(".text-red-500")).toBeDefined();
  });

  test("renders error state with default message when no error provided", () => {
    const { container } = render(<TransactionStep {...defaultProps} status="error" />);

    expect(container.textContent).includes("Transaction failed");
    expect(container.querySelector(".text-red-500")).toBeDefined();
  });

  test("renders step numbers correctly", () => {
    const { container: container1 } = render(<TransactionStep {...defaultProps} id={0} />);
    const { container: container2 } = render(<TransactionStep {...defaultProps} id={1} />);

    expect(container1.textContent).includes("1");
    expect(container2.textContent).includes("2");
  });

  test("renders correct icons for different states", () => {
    const states = ["idle", "pending", "waiting", "success", "error"] as const;
    const iconClasses = {
      idle: "border-amber-500",
      pending: "text-blue-500",
      waiting: "text-amber-500",
      success: "border-green-500",
      error: "border-red-500",
    };

    states.forEach(status => {
      const { container } = render(<TransactionStep {...defaultProps} status={status} />);
      expect(container.querySelector(`.${iconClasses[status]}`)).toBeDefined();
    });
  });

  test("handles external link attributes correctly", () => {
    const { container } = render(<TransactionStep {...defaultProps} status="success" txHash={mockTxHash} />);

    const link = container.querySelector("a");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link?.getAttribute("target")).toBe("_blank");
  });

  test("renders without txHash in success state", () => {
    const { container } = render(<TransactionStep {...defaultProps} status="success" />);

    expect(container.querySelector("a")).toBeNull();
  });
});
