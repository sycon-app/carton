import { useMemo } from "react";

import { print } from "../print";
import type { FitResult } from "lib/structs/FitResult";

export default function useInstructionsPrinting(fitResult?: FitResult) {
    const {
        itemWithPadding,
        unalteredDimensions,
        alteredDimensions,
        isItemRotated,
        stackCount,
    } = fitResult ?? {
        item: { length: 0, width: 0, height: 0 },
        itemWithPadding: { length: 0, width: 0, height: 0 },
        unalteredDimensions: { length: 0, width: 0, height: 0 },
        alteredDimensions: { length: 0, width: 0, height: 0 },
        isItemRotated: false,
        stackCount: 0,
    };

    const isAdjusted = useMemo(() => {
        return (
            unalteredDimensions.length !== alteredDimensions.length ||
            unalteredDimensions.width !== alteredDimensions.width
        );
    }, [unalteredDimensions, alteredDimensions]);

    return () => {
        let printText = "";

        printText += `${unalteredDimensions.length}x${unalteredDimensions.width}x${unalteredDimensions.height}`;
        printText += " -> ";
        printText += `${alteredDimensions.length}x${alteredDimensions.width}x${alteredDimensions.height}\n\n`;

        if (isItemRotated) {
            printText += "- Item laid on its side\n";
        }

        if (stackCount > 1) {
            printText += `- Stacked ${stackCount}x\n`;
        }

        if (isAdjusted) {
            printText += `- Adjusted (${
                alteredDimensions.length - unalteredDimensions.length
            }})\n`;
        }

        if (alteredDimensions.height - itemWithPadding.height !== 0) {
            printText += `- Can be cut down to ${alteredDimensions.length}x${
                alteredDimensions.width
            }x${itemWithPadding.height} (-${
                alteredDimensions.height - itemWithPadding.height
            })\n`;
        }

        print(printText);
    };
}
