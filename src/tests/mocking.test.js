import { describe, expect, it, vi } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../mocking";
// Celle-ci en deuxième
import { trackPageView } from "../libs/analytics";
import { getExchangeRate } from "../libs/currency";
import { sendEmail } from "../libs/email";
import { charge } from "../libs/payment";
import security from "../libs/security";
import { getShippingQuote } from "../libs/shipping";

// Permet de remplacer des fonctions par des mocks. Cette ligne s'excute en premier. ==> Hosting
vi.mock("../libs/currency");
vi.mock("../libs/shipping");
vi.mock("../libs/analytics");
vi.mock("../libs/payment");
// Partial mocking
vi.mock("../libs/email", async (importOriginal) => {
  const originalModule = await importOriginal();
  return { ...originalModule, sendEmail: vi.fn() };
});

describe("test suite", () => {
  it("test case 1", () => {
    const greet = vi.fn();
    greet.mockReturnValue("Hello");

    const result = greet();
    console.log(result);
  });

  it("test case 2", () => {
    const greet = vi.fn();
    greet.mockResolvedValue("Hello");

    greet().then((result) => console.log(result));
  });

  it("test case 3", () => {
    const greet = vi.fn();
    greet.mockImplementation((name) => "Hello " + name);

    const result = greet("Théo");
    console.log(result);
  });

  it("test case 4", () => {
    const greet = vi.fn();
    greet.mockImplementation((name) => "Hello " + name);

    greet("Théo");

    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledWith("Théo");
    expect(greet).toHaveBeenCalledOnce();
  });

  it("test case 5", () => {
    const sendText = vi.fn();
    sendText.mockReturnValueOnce("ok");

    const result = sendText("message");

    expect(sendText).toHaveBeenCalledWith("message");
    expect(result).toBe("ok");
  });
});

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("should return shipping info if quote exists", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });

    const result = getShippingInfo("Paris");

    expect(result).toMatch(/2 Days/i);
    expect(result).toMatch("$10");
  });

  it("should return shipping unvavailable if quote is doesnt exists", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const result = getShippingInfo("Paris");

    expect(result).toMatch(/unavailable/i);
  });
});

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("sumbmitOrder", () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: "1234" };
  it("should charge the customer", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return success when payment is sucessfull", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it("should return errpr when payment is not sucessfull", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ error: "payment_error", success: false });
  });
});

describe("signUp", () => {
  const email = "name@domaine.com";

  // beforeEach(() => {
  //   vi.mocked(sendEmail).mockClear();
  // });

  it("should return false if email is not valid", async () => {
    const result = await signUp("a");

    expect(result).toBeFalsy();
  });

  it("should return true if email is valid", async () => {
    const result = await signUp(email);

    expect(result).toBeTruthy();
  });

  it("should send welcome email if email is valid", async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];

    // Use mocks only for mocking external dependencies
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  it("should email the one-time login code", async () => {
    const email = "name@dmomain.com";
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe("isOnline", () => {
  it("should return false if current hour outside opening hours", () => {
    vi.setSystemTime("2024-01-01 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-01-01 20:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true if current hour within opening hours", () => {
    vi.setSystemTime("2024-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return 0.2 on Christmas day", () => {
    vi.setSystemTime("2024-12-25");
    expect(getDiscount()).toBe(0.2);
  });

  it("should return 0 on any other day", () => {
    vi.setSystemTime("2024-12-24");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2024-12-26");
    expect(getDiscount()).toBe(0);
  });
});
