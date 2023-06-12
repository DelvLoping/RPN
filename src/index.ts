export function isOperator(token: string): boolean {
    return ["+", "-", "*", "/", "MOD", "NEGATE"].includes(token);
}

export function isValidNumber(token: string): boolean {
    return /^[0-9]+(\.[0-9]+)?$/.test(token);
}

export function parseRPNExpression(expression: string): string[] {
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

export function isOperationDivisonByZero(operator: string, operand1: number, operand2: number): boolean {
    switch (operator) {
        case '/':
            return operand2 !== 0;
        case 'MOD':
            return operand2 !== 0;
        default:
            return true;
    }
}

export function performOperation(operator: string, operand1: number, operand2: number): number {

    if (isOperationDivisonByZero(operator, operand1, operand2)) {

        switch (operator) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '*':
                return operand1 * operand2;
            case '/':
                return operand1 / operand2;
            case 'MOD':
                return operand1 % operand2;
            case 'NEGATE':
                return -operand2;
            default:
                throw new Error('Invalid operator: ' + operator);
        }
    } else {
        throw new Error('Invalid operation division by 0');
    }
}


export function rpn(expression: string): number {
    const tokens = parseRPNExpression(expression);
    const stack: number[] = [];

    for (const token of tokens) {
        if (isValidNumber(token)) {
            stack.push(Number(token));
        } else if (isOperator(token)) {
            const operand2 = stack.pop();
            const operand1 = stack.pop();
            const result = performOperation(token, operand1, operand2);
            stack.push(result);
        }
    }

    return stack.pop();
}
