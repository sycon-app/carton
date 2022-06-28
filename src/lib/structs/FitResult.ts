import type { BoxDimensions } from "./BoxDimensions";

export interface FitResult {
    item: BoxDimensions;
    itemWithPadding: BoxDimensions;
    isItemRotated: boolean;
    unalteredDimensions: BoxDimensions;
    alteredDimensions: BoxDimensions;
    volume: number;
    stackCount: number;
}
