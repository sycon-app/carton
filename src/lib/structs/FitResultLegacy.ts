import type { BoxDimensions } from "./BoxDimensions";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface FitResult_Legacy {
    item: BoxDimensions;
    itemWithPadding: BoxDimensions;
    isItemRotated: boolean;
    unalteredDimensions: BoxDimensions;
    alteredDimensions: BoxDimensions;
    volume: number;
    stackCount: number;
}
