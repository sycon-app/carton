import type { BoxDimensions } from "./BoxDimensions";

export interface BoxData {
    meta: {
        _id: string;
        preferNoStack: boolean;
        preferNoAdjust: boolean;
        weightRating: number;
    };
    dimensions: BoxDimensions;
}
