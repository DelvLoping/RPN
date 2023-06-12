type Operator = "+" | "-" | "*" | "/" | "MOD" | "NEGATE";

export function isOperator(token: string): boolean {
    return ["+", "-", "*", "/", "MOD", "NEGATE"].includes(token);
}

export function isValidNumber(token: string): boolean {
    return /^[0-9]+(\.[0-9]+)?$/.test(token);
}

export function parseRPN(expression: string): string[] {
    const tokens = expression.split(" ");
    const parsedTokens: string[] = [];
    let nbNumber = 0;
    let nbOperator = 0;

    for (const token of tokens) {
        if (isOperator(token) || isValidNumber(token)) {

            if (isValidNumber(token))
                nbNumber++;

            if (isOperator(token) && token !== "NEGATE")
                nbOperator++;

            parsedTokens.push(token);
        } else {
            throw new Error("Invalid expression");
        }
    }

    if (nbNumber - nbOperator !== 1) {
        throw new Error("Invalid expression");
    }

    return parsedTokens;
}


