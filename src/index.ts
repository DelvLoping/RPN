type BinaryOperator = "+" | "-" | "*" | "/" | "MOD";
type UnaryOperator = "NEGATE";

export class Pile<T> {
    private readonly stack: ReadonlyArray<T>;

    constructor(...items: T[]) {
        this.stack = [...items];
    }

    public push(...items: T[]): Pile<T> {
        return new Pile<T>(...this.stack, ...items);
    }

    public pop(): Pile<T> {
        if (this.isEmpty()) {
            throw new Error('The pile is empty.');
        }

        const newStack = this.stack.slice(0, this.stack.length - 1);
        return new Pile<T>(...newStack);
    }

    public isEmpty(): boolean {
        return this.stack.length === 0;
    }

    public peek(): T | undefined {
        return this.stack[this.stack.length - 1];
    }

    public toArray(): ReadonlyArray<T> {
        return [...this.stack];
    }
}



export function isBinaryOperator(token: string): token is BinaryOperator {
    return ["+", "-", "*", "/", "MOD"].includes(token);
}

export function isUnaryOperator(token: string): token is UnaryOperator {
    return ["NEGATE"].includes(token);
}

export function isValidNumber(token: string): boolean {
    return /^[0-9]+(\.[0-9]+)?$/.test(token);
}

export function validateTokens(tokens: string[]): void {
    const errorMessageInvalidExpression = "Invalid expression";
    let numberCount = 0;
    let operatorCount = 0;

    for (const token of tokens) {
        if ((isBinaryOperator(token) && (numberCount > 1)) || isValidNumber(token) || isUnaryOperator(token)) {
            if (isValidNumber(token)) {
                numberCount++;
            }

            if (isBinaryOperator(token)) {
                operatorCount++;
            }
        } else {
            throw new Error(errorMessageInvalidExpression);
        }
    }

    if (numberCount - operatorCount !== 1) {
        throw new Error(errorMessageInvalidExpression);
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


export function performBinaryOperation(operator: string, operand1: number, operand2: number): number {

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
            default:
                throw new Error('Invalid operator: ' + operator);
        }
    } else {
        throw new Error('Invalid operation division by 0');
    }
}

export function performUnaryOperation(operator: string, operand: number): number {
    if (operand === 0) {
        return 0;
    }
    switch (operator) {
        case 'NEGATE':
            return -operand;
        default:
            throw new Error('Invalid operator: ' + operator);
    }

}


export function rpn(expression: string): number {
    const tokens = parseRPNExpression(expression);
    const stack = new Pile<number>();
    return recursifRpn(stack, tokens);
}

export function recursifRpn(stack: Pile<number>, tokens: string[]): number {


    if (tokens.length === 0) {
        return stack.peek();
    }

    let token = tokens.shift();

    if (isValidNumber(token)) {
        stack = stack.push(Number(token));
    } else if (isBinaryOperator(token)) {
        const operand2 = stack.peek();
        stack = stack.pop();
        const operand1 = stack.peek();
        stack = stack.pop();
        const result = performBinaryOperation(token, operand1, operand2);
        stack = stack.push(result);

    } else if (isUnaryOperator(token)) {

        const operand = stack.peek();
        stack = stack.pop();
        const result = performUnaryOperation(token, operand);
        stack = stack.push(result);

    }

    return recursifRpn(stack, tokens);

}

