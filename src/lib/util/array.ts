export function moveItemsToEnd<T>(
    arr: T[],
    condition: (target: T) => boolean
): T[] {
    const startArr: T[] = [];
    const endArr: T[] = [];

    for (let i = 0; i < arr.length; i += 1) {
        if (condition(arr[i])) {
            endArr.push(arr[i]);
        } else {
            startArr.push(arr[i]);
        }
    }

    return [...startArr, ...endArr];
}
