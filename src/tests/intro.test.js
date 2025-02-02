import { describe, expect, it } from "vitest";
import { calculateAverage, factorial, fizzBuzz, max } from "../intro";

describe("max", () => {
  it("should return the first argument if it is greater", () => {
    // Arrange
    const a = 2;
    const b = 1;
    // Act
    const result = max(a, b);
    // Assert
    expect(result).toBe(2);
  });

  it("should return the second argument if it is greater", () => {
    // Arrange
    const a = 1;
    const b = 2;
    // Act
    const result = max(a, b);
    // Assert
    expect(result).toBe(2);
  });

  it("should return the first argument if arguments are equal", () => {
    // Arrange
    const a = 1;
    const b = 1;
    // Act
    const result = max(a, b);
    // Assert
    expect(result).toBe(1);
  });
});

describe("fizzBuzz", () => {
  it("should return FizzBuzz if n is divisible by 3 and 5", () => {
    const n = 15;

    const result = fizzBuzz(n);

    expect(result).toBe("FizzBuzz");
  });

  it("should return FizzBuzz if n is divisible by 3", () => {
    const n = 3;

    const result = fizzBuzz(n);

    expect(result).toBe("Fizz");
  });

  it("should return FizzBuzz if n is divisible by 5", () => {
    const n = 5;

    const result = fizzBuzz(n);

    expect(result).toBe("Buzz");
  });

  it("should return string of n if it is not divisible by 5 or 3", () => {
    const n = 7;

    const result = fizzBuzz(n);

    expect(result).toBe("7");
  });
});

describe("calculateAverage", () => {
  it("should return NaN if given an empty array", () => {
    expect(calculateAverage([])).toBe(NaN);
  });
  it("should calculate the average of an array with a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });
  it("should calculate the average of an array with 2 elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe("factorial", () => {
  it("should return 1 given 0", () => {
    expect(factorial(0)).toBe(1);
  });
  it("should return 1 given 1", () => {
    expect(factorial(1)).toBe(1);
  });
  it("should return 2 given 2", () => {
    expect(factorial(2)).toBe(2);
  });
  it("should return 6 given 3", () => {
    expect(factorial(3)).toBe(6);
  });
  it("should return 24 given 4", () => {
    expect(factorial(4)).toBe(24);
  });
  it("should return undefined given negative", () => {
    expect(factorial(-1)).toBeUndefined();
  });
});
