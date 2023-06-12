// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import fc from "fast-check";

expect.extend(matchers);

import { isBinaryOperator, isUnaryOperator, isValidNumber, validateTokens, parseRPNExpression, isOperationDivisionByZero, performBinaryOperation, performUnaryOperation, rpn } from "./index";

//////////////////////////////////////////////////////////////////////////////   isBinaryOperator  //////////////////////////////////////////////////////////////////////////////
describe('isBinaryOperator', () => {
  it('should return true for the "+" operator', () => {
    expect(isBinaryOperator("+")).toBe(true);
  });

  it('should return true for the "-" operator', () => {
    expect(isBinaryOperator("-")).toBe(true);
  });

  it('should return true for the "*" operator', () => {
    expect(isBinaryOperator("*")).toBe(true);
  });

  it('should return true for the "/" operator', () => {
    expect(isBinaryOperator("/")).toBe(true);
  });

  it('should return true for the "MOD" operator', () => {
    expect(isBinaryOperator("MOD")).toBe(true);
  });

  it('should return false for an empty string', () => {
    expect(isBinaryOperator("")).toBe(false);
  });

  it('should return false for the "add" operator', () => {
    expect(isBinaryOperator("add")).toBe(false);
  });

  it('should return false for the "subtract" operator', () => {
    expect(isBinaryOperator("subtract")).toBe(false);
  });

  it('should return false for the "multiply" operator', () => {
    expect(isBinaryOperator("multiply")).toBe(false);
  });

  it('should return false for the "divide" operator', () => {
    expect(isBinaryOperator("divide")).toBe(false);
  });

  it('should return false for the "modulus" operator', () => {
    expect(isBinaryOperator("modulus")).toBe(false);
  });

  it('should return false for the "negate" operator', () => {
    expect(isBinaryOperator("negate")).toBe(false);
  });

  it('should return false for the "NEGATE" operator', () => {
    expect(isBinaryOperator("NEGATE")).toBe(false);
  });
});

//////////////////////////////////////////////////////////////////////////////   isUnaryOperator  //////////////////////////////////////////////////////////////////////////////

describe('isUnaryOperator', () => {
  it('should return true for the "NEGATE" operator', () => {
    expect(isUnaryOperator("NEGATE")).toBe(true);
  });

  it('should return false for an empty string', () => {
    expect(isUnaryOperator("")).toBe(false);
  });

  it('should return false for the "add" operator', () => {
    expect(isUnaryOperator("add")).toBe(false);
  });

  it('should return false for the "subtract" operator', () => {
    expect(isUnaryOperator("subtract")).toBe(false);
  });

  it('should return false for the "multiply" operator', () => {
    expect(isUnaryOperator("multiply")).toBe(false);
  });

  it('should return false for the "divide" operator', () => {
    expect(isUnaryOperator("divide")).toBe(false);
  });

  it('should return false for the "modulus" operator', () => {
    expect(isUnaryOperator("modulus")).toBe(false);
  });

  it('should return false for the "negate" operator', () => {
    expect(isUnaryOperator("negate")).toBe(false);
  });

  it('should return false for the "+" operator', () => {
    expect(isUnaryOperator("+")).toBe(false);
  });

  it('should return false for the "-" operator', () => {
    expect(isUnaryOperator("-")).toBe(false);
  });

  it('should return false for the "*" operator', () => {
    expect(isUnaryOperator("*")).toBe(false);
  });

  it('should return false for the "/" operator', () => {
    expect(isUnaryOperator("/")).toBe(false);
  });

  it('should return false for the "MOD" operator', () => {
    expect(isUnaryOperator("MOD")).toBe(false);
  });
});

//////////////////////////////////////////////////////////////////////////////   isValidNumber  //////////////////////////////////////////////////////////////////////////////

describe("isValidNumber", () => {
  it("should return true for the number '10'", () => {
    expect(isValidNumber("10")).toBe(true);
  });

  it("should return true for the number '3.14'", () => {
    expect(isValidNumber("3.14")).toBe(true);
  });

  it("should return true for the number '0'", () => {
    expect(isValidNumber("0")).toBe(true);
  });

  it("should return false for the number '-5'", () => {
    expect(isValidNumber("-5")).toBe(false);
  });

  it("should return false for the string 'abc'", () => {
    expect(isValidNumber("abc")).toBe(false);
  });

  it("should return false for the string '1a'", () => {
    expect(isValidNumber("1a")).toBe(false);
  });

  it("should return false for the number '10.3.5'", () => {
    expect(isValidNumber("10.3.5")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isValidNumber("")).toBe(false);
  });
});

//////////////////////////////////////////////////////////////////////////////   validateTokens  //////////////////////////////////////////////////////////////////////////////

describe("validateTokens", () => {
  it("should not throw an error for a valid expression", () => {
    expect(validateTokens(['5', '2', '*', '3', '-'])).toBe(undefined);
  });

  it("should throw an error for an invalid expression with missing operand", () => {
    expect(() => validateTokens(['5', '2', '*', '3'])).toThrow('Invalid expression');
  });

  it("should throw an error for an invalid expression with invalid operator", () => {
    expect(() => validateTokens(['5', '+', 'invalid', '3'])).toThrow('Invalid expression');
  });

  it("should throw an error for an invalid expression with extra operand", () => {
    expect(() => validateTokens(['5', '*', '2', '3', '-'])).toThrow('Invalid expression');
  });
});

//////////////////////////////////////////////////////////////////////////////   parseRPNExpression  //////////////////////////////////////////////////////////////////////////////

describe("parseRPNExpression", () => {

  it("should parse a valid RPN expression with multiple operators and operands", () => {
    expect(parseRPNExpression("10 3 2 - -")).toEqual(["10", "3", "2", "-", "-"]);
  });

  it("should parse a valid RPN expression with operators and operands", () => {
    expect(parseRPNExpression("10 3 - 2 -")).toEqual(["10", "3", "-", "2", "-"]);
  });

  it("should parse a valid RPN expression with addition", () => {
    expect(parseRPNExpression("1 1 +")).toEqual(["1", "1", "+"]);
  });

  it("should parse a valid RPN expression with modulus", () => {
    expect(parseRPNExpression("4 3 MOD")).toEqual(["4", "3", "MOD"]);
  });

  it("should parse a valid RPN expression with unary operator", () => {
    expect(parseRPNExpression("1 NEGATE")).toEqual(["1", "NEGATE"]);
  });

  it("should parse a valid RPN expression with multiple operators and operands, including a unary operator", () => {
    expect(parseRPNExpression("1 2 + NEGATE")).toEqual(["1", "2", "+", "NEGATE"]);
  });

  it("should parse a valid RPN expression with a single operand", () => {
    expect(parseRPNExpression("2")).toEqual(["2"]);
  });


  it("should throw an error for an RPN expression with invalid addition", () => {
    expect(() => parseRPNExpression("1 -1 +")).toThrow("Invalid expression");
  });

  it("should throw an error for an RPN expression with invalid subtraction", () => {
    expect(() => parseRPNExpression("1 - -")).toThrow("Invalid expression");
  });

  it("should throw an error for an RPN expression with invalid multiplication", () => {
    expect(() => parseRPNExpression("10 *")).toThrow("Invalid expression");
  });

  it("should throw an error for an RPN expression with invalid operand", () => {
    expect(() => parseRPNExpression("abc 5 +")).toThrow("Invalid expression");
  });

});

//////////////////////////////////////////////////////////////////////////////   isOperationDivisionByZero  //////////////////////////////////////////////////////////////////////////////

describe('isOperationDivisionByZero', () => {

  it('should return true for addition operation', () => {
    expect(isOperationDivisionByZero('+', 5, 2)).toBe(true);
  });

  it('should return true for subtraction operation', () => {
    expect(isOperationDivisionByZero('-', 8, 3)).toBe(true);
  });

  it('should return true for multiplication operation', () => {
    expect(isOperationDivisionByZero('*', 4, 6)).toBe(true);
  });

  it('should return true for division operation', () => {
    expect(isOperationDivisionByZero('/', 10, 2)).toBe(true);
  });

  it('should return true for modulus operation', () => {
    expect(isOperationDivisionByZero('MOD', 7, 4)).toBe(true);
  });

  it('should return true for unary negate operation', () => {
    expect(isOperationDivisionByZero('NEGATE', 0, 5)).toBe(true);
  });

  it('should return false for division operation with dividend as zero', () => {
    expect(isOperationDivisionByZero('/', 10, 0)).toBe(false);
  });

  it('should return false for modulus operation with dividend as zero', () => {
    expect(isOperationDivisionByZero('MOD', 7, 0)).toBe(false);
  });

});

//////////////////////////////////////////////////////////////////////////////   performBinaryOperation  //////////////////////////////////////////////////////////////////////////////

describe("performBinaryOperation", () => {
  it("should perform addition correctly", () => {
    expect(performBinaryOperation("+", 3, 4)).toEqual(7);
  });

  it("should perform subtraction correctly", () => {
    expect(performBinaryOperation("-", 6, 2)).toEqual(4);
  });

  it("should perform multiplication correctly", () => {
    expect(performBinaryOperation("*", 5, 3)).toEqual(15);
  });

  it("should perform division correctly", () => {
    expect(performBinaryOperation("/", 10, 2)).toEqual(5);
  });

  it("should perform modulus correctly", () => {
    expect(performBinaryOperation("MOD", 10, 2)).toEqual(0);
  });

  it("should throw an error for unknown operator", () => {
    expect(() => performBinaryOperation("?", 5, 2)).toThrow("Invalid operator: ?");
  });

  it("should throw an error for unary operator used as binary", () => {
    expect(() => performBinaryOperation("NEGATE", null, 2)).toThrow("Invalid operator: NEGATE");
  });

});

//////////////////////////////////////////////////////////////////////////////   performUnaryOperation  //////////////////////////////////////////////////////////////////////////////

describe("performUnaryOperation", () => {
  it("should return correct result for NEGATE operation with 0", () => {
    expect(performUnaryOperation("NEGATE", 0)).toEqual(0);
  });

  it("should return correct result for NEGATE operation with 10", () => {
    expect(performUnaryOperation("NEGATE", 10)).toEqual(-10);
  });

  it("should throw an error for invalid operator '?'", () => {
    expect(() => performUnaryOperation("?", 5)).toThrow("Invalid operator: ?");
  });

  it("should throw an error for invalid operator '+'", () => {
    expect(() => performUnaryOperation("+", 3)).toThrow("Invalid operator: +");
  });

  it("should throw an error for invalid operator '-'", () => {
    expect(() => performUnaryOperation("-", 6)).toThrow("Invalid operator: -");
  });

  it("should throw an error for invalid operator '*'", () => {
    expect(() => performUnaryOperation("*", 5)).toThrow("Invalid operator: *");
  });

  it("should throw an error for invalid operator '/'", () => {
    expect(() => performUnaryOperation("/", 10)).toThrow("Invalid operator: /");
  });

  it("should throw an error for invalid operator 'MOD'", () => {
    expect(() => performUnaryOperation("MOD", 10)).toThrow("Invalid operator: MOD");
  });
});

//////////////////////////////////////////////////////////////////////////////   rpn  //////////////////////////////////////////////////////////////////////////////

describe("rpn", () => {
  it("should evaluate valid RPN expressions correctly - Case 10 3 2 - - ", () => {
    expect(rpn("10 3 2 - -")).toEqual(9);
  });

  it("should evaluate valid RPN expressions correctly - Case 10 3 - 2 -", () => {
    expect(rpn("10 3 - 2 -")).toEqual(5);
  });

  it("should evaluate valid RPN expressions correctly - Case 1 1 +", () => {
    expect(rpn("1 1 +")).toEqual(2);
  });

  it("should evaluate valid RPN expressions correctly - Case 4 3 MOD", () => {
    expect(rpn("4 3 MOD")).toEqual(1);
  });

  it("should evaluate valid RPN expressions correctly - Case 1 NEGATE", () => {
    expect(rpn("1 NEGATE")).toEqual(-1);
  });

  it("should evaluate valid RPN expressions correctly - Case 1 2 + NEGATE", () => {
    expect(rpn("1 2 + NEGATE")).toEqual(-3);
  });

  it("should evaluate valid RPN expressions correctly - Case 2", () => {
    expect(rpn("2")).toEqual(2);
  });

  it("should evaluate valid RPN expressions correctly - Case 1 2 NEGATE +", () => {
    expect(rpn("1 2 NEGATE +")).toEqual(-1);
  });

  it("should evaluate valid RPN expressions correctly - Case 10 2 /", () => {
    expect(rpn("10 2 /")).toEqual(5);
  });

  it("should evaluate valid RPN expressions correctly - Case 3 4 * 5 6 * +", () => {
    expect(rpn("3 4 * 5 6 * +")).toEqual(42);
  });

  it("should throw an error for invalid RPN expressions - Case 1 -1 +", () => {
    expect(() => rpn("1 -1 +")).toThrow("Invalid expression");
  });

  it("should throw an error for invalid RPN expressions - Case 1 - -", () => {
    expect(() => rpn("1 - -")).toThrow("Invalid expression");
  });

  it("should throw an error for invalid RPN expressions - Case 10 - 3 2 -", () => {
    expect(() => rpn("10 - 3 2 -")).toThrow("Invalid expression");
  });

  it("should throw an error for invalid RPN expressions - Case 10 *", () => {
    expect(() => rpn("10 *")).toThrow("Invalid expression");
  });

  it("should throw an error for invalid RPN expressions - Case abc 5 +", () => {
    expect(() => rpn("abc 5 +")).toThrow("Invalid expression");
  });

  it("should throw an error for invalid RPN expressions - Case 1 0 /", () => {
    expect(() => rpn("1 0 /")).toThrow("Invalid operation division by 0");
  });

  it("should throw an error for invalid RPN expressions - Case \"\"", () => {
    expect(() => rpn("")).toThrow("Invalid expression");
  });
});

