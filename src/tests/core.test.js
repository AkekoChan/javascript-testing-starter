import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from "../core";

describe("getCoupons", () => {
  it("should return an array", () => {
    const coupons = getCoupons();

    expect(coupons).toBeInstanceOf(Array);
    expect(coupons).not.toHaveLength(0);
  });

  it("should return an array with valid coupon codes", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(coupon.code).toBeTypeOf("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return an array with valid coupon discounts", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(coupon.discount).toBeTypeOf("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  it("should handle non-numeric price", () => {
    const result = calculateDiscount("10", "SAVE10");
    expect(result).toMatch(/invalid/i);
  });

  it("should handle non-string discount code", () => {
    const result = calculateDiscount(10, 10);
    expect(result).toMatch(/invalid/i);
  });

  it("should handle invalide discount code", () => {
    const result = calculateDiscount(10, "INVALID");
    expect(result).toBe(10);
  });
});

describe("validateUserInput", () => {
  it("should return success if given valid input", () => {
    const errors = validateUserInput("Théo", 21);
    expect(errors).toMatch(/success/i);
  });

  it("should handle non-string username", () => {
    const errors = validateUserInput(21, 21);
    expect(errors).toMatch(/invalid/i);
  });

  it("should return an error if username doesn't have enough carecters", () => {
    const errors = validateUserInput("Th", 21);
    expect(errors).toMatch(/invalid/i);
  });

  it("should return an error if username doesn't have too many carecters", () => {
    const errors = validateUserInput("T".repeat(101), 21);
    expect(errors).toMatch(/invalid/i);
  });

  it("should handle non-number age", () => {
    const errors = validateUserInput("Théo", "21");
    expect(errors).toMatch(/invalid/i);
  });

  it("should return an error if age less than 18", () => {
    const errors = validateUserInput("Théo", 17);
    expect(errors).toMatch(/invalid/i);
  });

  it("should return an error if age greater than 100", () => {
    const errors = validateUserInput("Théo", 101);
    expect(errors).toMatch(/invalid/i);
  });

  it("should return an error if both usernane and age are invalid", () => {
    expect(validateUserInput("Théo", 101)).toMatch(/invalid age/i);
    expect(validateUserInput("", 101)).toMatch(/invalid username/i);
  });
});

describe("isPriceInRange", () => {
  it.each([
    {
      scenario: "price < min",
      price: -10,
      result: false,
    },
    {
      scenario: "price = min",
      price: 0,
      result: true,
    },
    {
      scenario: "price between min and max",
      price: 50,
      result: true,
    },
    {
      scenario: "price > max",
      price: 200,
      result: false,
    },
    {
      scenario: "price = max",
      price: 100,
      result: true,
    },
  ])("should return $result when $scenario", ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe("isValidUsername", () => {
  it("should return false when the username length is outside the range", () => {
    expect(isValidUsername("Leo")).toBeFalsy();
    expect(isValidUsername("LeoQuiFaitLeToto")).toBeFalsy();
  });

  it("should return true when the username length is within the range", () => {
    expect(isValidUsername("LeoLePlusBeau")).toBeTruthy();
  });

  it("should return true when the username length is egal to the mix or max", () => {
    expect(isValidUsername("LeoBg")).toBeTruthy();
    expect(isValidUsername("LeoBgDu75000542")).toBeTruthy();
  });

  it("should return false for invalid input types", () => {
    expect(isValidUsername(null)).toBeFalsy();
    expect(isValidUsername(undefined)).toBeFalsy();
    expect(isValidUsername(1)).toBeFalsy();
  });
});

describe("canDrive", () => {
  // Vérifier si le countryCode est valide
  // Vérifier si l'age ne correspond pas (min)
  // Vérifier si l'age correspond

  it("should return error if countryCode is invalid", () => {
    expect(canDrive(16, "FR")).toMatch(/invalid/i);
  });

  // Parameterized Tets
  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 17, country: "US", result: true },
    { age: 16, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 18, country: "UK", result: true },
  ])(
    "should return $result for ($age, $country)",
    ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    },
  );
});

describe("fetchData", () => {
  it("should return an array of numbers", async () => {
    try {
      await fetchData();
      // expect(result).toBeInstanceOf(Array);
      // expect(result).not.toHaveLength(0);
    } catch (error) {
      expect(error).toHaveProperty("reason");
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

// setup and teardown
describe("test suite", () => {
  beforeAll(() => {
    console.log("beforeAll called");
  });

  beforeEach(() => {
    console.log("beforeEach called");
  });

  afterAll(() => {
    console.log("afterAll called");
  });

  afterEach(() => {
    console.log("afterEach called");
  });

  it("test case 1", () => {});
  it("test case 2", () => {});
});

describe("Stack", () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });

  it("push should add an item to the stack", () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });

  it("pop should remove and return the top item from the stack", () => {
    stack.push(1);
    stack.push(2);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it("pop should throw an error if stack is empty", () => {
    expect(() => stack.pop()).toThrowError(/empty/i);
  });

  it("peek should return the top item from the stack without removing item", () => {
    stack.push(1);
    stack.push(2);

    const peekingItem = stack.peek();

    expect(peekingItem).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it("peek should throw an error if stack is empty", () => {
    expect(() => stack.peek()).toThrowError(/empty/i);
  });

  it("isEmpty should return true if stack is empty", () => {
    expect(stack.isEmpty()).toBeTruthy();
  });

  it("isEmpty should return false if stack is empty", () => {
    stack.push(1);
    expect(stack.isEmpty()).toBeFalsy();
  });

  it("size should return the number of items in the stack", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.size()).toBe(2);
  });

  it("clear should remove all items from the stack", () => {
    stack.push(1);
    stack.push(2);

    stack.clear();

    expect(stack.size()).toBe(0);
  });
});

// module 34
