type Operator = "+" | "-" | "*" | "/" | "MOD" | "NEGATE";

export function isOperator(token: string): boolean {
    return ["+", "-", "*", "/", "MOD", "NEGATE"].includes(token);
}

