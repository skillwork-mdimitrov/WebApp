// Remove element from array by value
export const removeFromArr = (array: number[], element): number => {
    let value: number = array.indexOf(element);

    if (value !== -1) {
        array.splice(value, 1);
    }
    return value;
};