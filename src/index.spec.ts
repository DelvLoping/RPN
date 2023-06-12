// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
import fc from "fast-check";

expect.extend(matchers);

import { isOperator } from "./index";


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
