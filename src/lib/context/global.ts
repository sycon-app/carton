import { createContext } from "react";

import type { BoxData } from "lib/structs/BoxData";

export const GlobalContext = createContext<{
    boxes: BoxData[] | undefined;
    setBoxes: React.Dispatch<React.SetStateAction<BoxData[] | undefined>>;
    isRunningDBTransaction: boolean;
}>({
    boxes: [],
    setBoxes: () => undefined,
    isRunningDBTransaction: false,
});
