import type { BoxDimensions } from "./BoxDimensions";

export interface BoxData {
    meta: {
        preferNoStack: boolean;
        preferNoAdjust: boolean;
    };
    dimensions: BoxDimensions;
}
