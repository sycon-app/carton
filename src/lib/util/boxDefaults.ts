import type { BoxData } from "lib/structs/BoxData";
import type { BoxDimensions } from "lib/structs/BoxDimensions";

export const boxDefaults65: BoxDimensions[] = [
    { length: 6, width: 6, height: 6 },
    { length: 6, width: 6, height: 48 },
    { length: 8, width: 8, height: 8 },
    { length: 10, width: 10, height: 10 },
    { length: 12, width: 9, height: 4 },
    { length: 12, width: 12, height: 6 },
    { length: 12, width: 12, height: 12 },
    { length: 14, width: 14, height: 14 },
    { length: 15, width: 12, height: 10 },
    { length: 15, width: 15, height: 48 },
    { length: 16, width: 16, height: 4 },
    { length: 16, width: 16, height: 16 },
    { length: 17, width: 11, height: 8 },
    { length: 18, width: 18, height: 18 },
    { length: 18, width: 14, height: 4 },
    { length: 20, width: 12, height: 12 },
    { length: 20, width: 20, height: 12 },
    { length: 24, width: 18, height: 6 },
    { length: 24, width: 12, height: 12 },
    { length: 24, width: 18, height: 18 },
    { length: 24, width: 24, height: 16 },
];

export const boxDefaults85: BoxDimensions[] = [
    { length: 24, width: 6, height: 18 },
    { length: 30, width: 6, height: 24 },
    { length: 32, width: 6, height: 42 },
    { length: 36, width: 8, height: 30 },
    { length: 36, width: 5, height: 46 },
    { length: 20, width: 20, height: 20 },
    { length: 24, width: 24, height: 24 },
];

export const boxDefaults100: BoxDimensions[] = [
    { length: 23, width: 16, height: 19 },
    { length: 24, width: 24, height: 24 },
    { length: 24, width: 24, height: 32 },
    { length: 36, width: 18, height: 26 },
    { length: 30, width: 30, height: 30 },
    { length: 42, width: 8, height: 60 },
];

export const boxDefaults: BoxData[] = [
    ...boxDefaults65.map((dim) => ({
        dimensions: {
            ...dim,
        },
        meta: {
            _id: `${dim.length}.${dim.width}.${dim.height}-65`,
            preferNoStack: false,
            preferNoAdjust: false,
            weightRating: 65,
        },
    })),
    ...boxDefaults85.map((dim) => ({
        dimensions: dim,
        meta: {
            _id: `${dim.length}.${dim.width}.${dim.height}-85`,
            preferNoStack: false,
            preferNoAdjust: false,
            weightRating: 85,
        },
    })),
    ...boxDefaults100.map((dim) => ({
        dimensions: {
            ...dim,
        },
        meta: {
            _id: `${dim.length}.${dim.width}.${dim.height}-100`,
            preferNoStack: false,
            preferNoAdjust: false,
            weightRating: 100,
        },
    })),
];
