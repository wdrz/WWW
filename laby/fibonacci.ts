
export function fib(x : number) : number {
    if (x <= 0) return 0;
    if (x === 1) return 1;
    else return fib(x-1) + fib(x-2);
}