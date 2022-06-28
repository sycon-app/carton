import type { DBSchema } from "idb";

import type { BoxData } from "lib/structs/BoxData";

export interface BoxDBSchema extends DBSchema {
    boxes: {
        value: BoxData;
        key: string;
        indexes: { "by-number": number };
    };
}
