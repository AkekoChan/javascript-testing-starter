import { describe, expect, it } from "vitest";
import { calculateDiscount } from "../main";

describe("calculateDiscount", () => {
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  it("should handle invalide discount code", () => {
    const result = calculateDiscount(10, "INVALID");
    expect(result).toBe(10);
  });
});
