import type { DBSchema } from "idb";

import type { BoxDimensions } from "../structs/BoxDimensions";

export interface BoxDBSchema extends DBSchema {
    boxes: {
        value: BoxDimensions;
        key: string;
        indexes: { "by-number": number };
    };
}
