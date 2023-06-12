export function isOperator(token: string): boolean {
    return ["+", "-", "*", "/", "MOD", "NEGATE"].includes(token);
}

export function isValidNumber(token: string): boolean {
    return /^[0-9]+(\.[0-9]+)?$/.test(token);
}

export function validateTokens(tokens: string[]): void {
    let numberCount = 0;
    let operatorCount = 0;

    for (const token of tokens) {
        if ((isOperator(token) && (numberCount > 1 || token === "NEGATE")) || isValidNumber(token)) {
            if (isValidNumber(token)) {
                numberCount++;
            }

            if (isOperator(token) && token !== "NEGATE") {
                operatorCount++;
            }
        } else {
            throw new Error("Invalid expression");
        }
    }

    if (numberCount - operatorCount !== 1) {
        throw new Error("Invalid expression");
    }
}

export function parseRPNExpression(expression: string): string[] {
    const tokens = expression.split(" ");
    validateTokens(tokens);
    return tokens;
}

export function isOperationDivisionByZero(operator: string, operand1: number, operand2: number): boolean {
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

    if (isOperationDivisionByZero(operator, operand1, operand2)) {

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
    console.log(expression)
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
