import type { BoxData } from "lib/structs/BoxData";
import type { BoxDimensions } from "lib/structs/BoxDimensions";

export const boxDimDefaults: BoxDimensions[] = [
    { length: 6, width: 6, height: 6 },
    { length: 8, width: 8, height: 8 },
    { length: 10, width: 10, height: 10 },
    { length: 12, width: 12, height: 12 },
    { length: 14, width: 14, height: 14 },
    { length: 16, width: 16, height: 16 },
    { length: 18, width: 18, height: 18 },
    { length: 20, width: 20, height: 20 },
    { length: 24, width: 24, height: 24 },
    { length: 30, width: 30, height: 30 },
    { length: 12, width: 9, height: 4 },
    { length: 12, width: 12, height: 6 },
    { length: 15, width: 12, height: 10 },
    { length: 17, width: 11, height: 8 },
    { length: 20, width: 12, height: 12 },
    { length: 24, width: 12, height: 12 },
    { length: 24, width: 18, height: 18 },
    { length: 20, width: 20, height: 12 },
    { length: 16, width: 16, height: 4 },
    { length: 6, width: 6, height: 48 },
    { length: 15, width: 15, height: 48 },
];

export const boxDefaults: BoxData[] = boxDimDefaults.map((dim) => ({
    meta: {
        preferNoAdjust: false,
        preferNoStack: false,
    },
    dimensions: dim,
}));
