// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import fc from "fast-check";

expect.extend(matchers);

import { isOperator, isValidNumber } from "./index";


describe('isOperator', () => {
  it('should return true for valid operators', () => {
    expect(isOperator("+")).toBe(true);
    expect(isOperator("-")).toBe(true);
    expect(isOperator("*")).toBe(true);
    expect(isOperator("/")).toBe(true);
    expect(isOperator("MOD")).toBe(true);
    expect(isOperator("NEGATE")).toBe(true);
  });

  it('should return false for invalid operators', () => {
    expect(isOperator("")).toBe(false);
    expect(isOperator("add")).toBe(false);
    expect(isOperator("subtract")).toBe(false);
    expect(isOperator("multiply")).toBe(false);
    expect(isOperator("divide")).toBe(false);
    expect(isOperator("modulus")).toBe(false);
    expect(isOperator("negate")).toBe(false);
  });
});

describe("isValidNumber", () => {
  it("should return true for valid positive numbers", () => {
    expect(isValidNumber("10")).toBe(true);
    expect(isValidNumber("3.14")).toBe(true);
    expect(isValidNumber("0")).toBe(true);
  });

  it("should return false for invalid numbers or negative numbers", () => {
    expect(isValidNumber("-5")).toBe(false);
    expect(isValidNumber("abc")).toBe(false);
    expect(isValidNumber("1a")).toBe(false);
    expect(isValidNumber("10.3.5")).toBe(false);
    expect(isValidNumber("")).toBe(false);
  });
});