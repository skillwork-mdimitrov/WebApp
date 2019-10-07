// Round a number to the second decimal
export const mathRoundToSecond = (num: number): number => {
    return Math.round(num * 100) / 100;
};