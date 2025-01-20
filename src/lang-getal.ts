export function langGetal(n: number): number {
    /**
     * Calculates the number of numbers between 10^index and 10^(index + 1)
     */
    const aantalGetallenTussen = (index: number): number => {
        const start = Math.pow(10, index);
        const end = Math.pow(10, index + 1);
        return end - start;
    }

    const index = Math.floor(Math.log10(n));
    const restwaarde = n - Math.pow(10, index);

    let sum = 0;
    for (let i = 0; i < index; i++) {
        sum += aantalGetallenTussen(i) * (i + 1);
    }
    return sum + (restwaarde + 1) * (index + 1);
}
