// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import fc from "fast-check";

expect.extend(matchers);

import { isOperator, isValidNumber, validateTokens, parseRPNExpression, isOperationDivisionByZero, performOperation, rpn } from "./index";


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

describe('validateTokens', () => {
  it('should not throw an error for a valid expression', () => {
    expect(validateTokens(['5', '2', '*', '3', '-'])).toBe(undefined);
  });

  it('should throw an error for an invalid expression', () => {
    expect(() => validateTokens(['5', '2', '*', '3'])).toThrow('Invalid expression');
    expect(() => validateTokens(['5', '+', 'invalid', '3'])).toThrow('Invalid expression');
    expect(() => validateTokens(['5', '*', '2', '3', '-'])).toThrow('Invalid expression');
  });

});

describe("parseRPNExpression", () => {
  it("should parse valid RPN expression correctly", () => {
    expect(parseRPNExpression("10 3 2 - -")).toEqual(["10", "3", "2", "-", "-"]);
    expect(parseRPNExpression("10 3 - 2 -")).toEqual(["10", "3", "-", "2", "-"]);
    expect(parseRPNExpression("1 1 +")).toEqual(["1", "1", "+"]);
    expect(parseRPNExpression("4 3 MOD")).toEqual(["4", "3", "MOD"]);
    expect(parseRPNExpression("1 NEGATE")).toEqual(["1", "NEGATE"]);
    expect(parseRPNExpression("1 2 + NEGATE")).toEqual(["1", "2", "+", "NEGATE"]);
    expect(parseRPNExpression("2")).toEqual(["2"]);
  });

  it("should throw an error for invalid RPN expression", () => {
    expect(() => parseRPNExpression("1 -1 +")).toThrow("Invalid expression");
    expect(() => parseRPNExpression("1 - -")).toThrow("Invalid expression");
    expect(() => parseRPNExpression("10 *")).toThrow("Invalid expression");
    expect(() => parseRPNExpression("abc 5 +")).toThrow("Invalid expression");
  });
});

describe('isOperationDivisionByZero', () => {
  it('should return true for valid operations', () => {
    expect(isOperationDivisionByZero('+', 5, 2)).toBe(true);
    expect(isOperationDivisionByZero('-', 8, 3)).toBe(true);
    expect(isOperationDivisionByZero('*', 4, 6)).toBe(true);
    expect(isOperationDivisionByZero('/', 10, 2)).toBe(true);
    expect(isOperationDivisionByZero('MOD', 7, 4)).toBe(true);
    expect(isOperationDivisionByZero('NEGATE', 0, 5)).toBe(true);
  });

  it('should return false for division by zero', () => {
    expect(isOperationDivisionByZero('/', 10, 0)).toBe(false);
    expect(isOperationDivisionByZero('MOD', 7, 0)).toBe(false);
  });
});


describe("performOperation", () => {
  it("should perform valid operations correctly", () => {
    expect(performOperation("+", 3, 4)).toEqual(7);
    expect(performOperation("-", 6, 2)).toEqual(4);
    expect(performOperation("*", 5, 3)).toEqual(15);
    expect(performOperation("/", 10, 2)).toEqual(5);
    expect(performOperation("MOD", 10, 2)).toEqual(0);
    expect(performOperation("NEGATE", null, 2)).toEqual(-2);
  });

  it("should throw an error for invalid operator", () => {
    expect(() => performOperation("?", 5, 2)).toThrow("Invalid operator: ?");
  });
});

describe("rpn", () => {
  it("should evaluate valid RPN expressions correctly", () => {
    expect(rpn("10 3 2 - -")).toEqual(9);
    expect(rpn("10 3 - 2 -")).toEqual(5);
    expect(rpn("1 1 +")).toEqual(2);
    expect(rpn("4 3 MOD")).toEqual(1);
    expect(rpn("1 NEGATE")).toEqual(-1);
    expect(rpn("1 2 + NEGATE")).toEqual(-3);
    expect(rpn("2")).toEqual(2);
    expect(rpn("10 2 /")).toEqual(5);
    expect(rpn("3 4 * 5 6 * +")).toEqual(42);
  });

  it("should throw an error for invalid RPN expressions", () => {
    expect(() => rpn("1 -1 +")).toThrow("Invalid expression");
    expect(() => rpn("1 - -")).toThrow("Invalid expression");
    expect(() => rpn("10 - 3 2 -")).toThrow("Invalid expression");
    expect(() => rpn("10 *")).toThrow("Invalid expression");
    expect(() => rpn("abc 5 +")).toThrow("Invalid expression");
    expect(() => rpn("1 0 /")).toThrow("Invalid operation division by 0");
    expect(() => rpn("")).toThrow("Invalid expression");
  });
});
