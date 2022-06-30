import { print } from "../print";
import type { FitData } from "lib/helpers/Fit";

export default function useInstructionsPrinting(fitResult?: FitData) {
    const {
        isItemRotated,
        unalteredContainerDimensions,
        alteredContainerDimensions,
        containerCutDownAmount,
        containerStackCount,
        containerAdjustAmount,
        tags,
    } = fitResult ?? {
        isItemRotated: false,
        unalteredContainerDimensions: { length: 0, width: 0, height: 0 },
        alteredContainerDimensions: { length: 0, width: 0, height: 0 },
        containerCutDownAmount: 0,
        containerStackCount: 0,
        containerAdjustAmount: 0,
        tags: {},
    };

    return () => {
        let printText = "";

        printText += `${unalteredContainerDimensions.length}x${unalteredContainerDimensions.width}x${unalteredContainerDimensions.height}`;
        printText += " -> ";
        printText += `${alteredContainerDimensions.length}x${alteredContainerDimensions.width}x${alteredContainerDimensions.height}\n\n`;

        if (isItemRotated) {
            printText += "- Item laid on its side\n";
        }

        if (tags.MODIFICATIONS_STACKED) {
            printText += `- Stacked ${containerStackCount}x\n`;
        }

        if (tags.MODIFICATIONS_ADJUSTED) {
            printText += `- Adjusted (${containerAdjustAmount}})\n`;
        }

        if (containerCutDownAmount > 0) {
            printText += `- Can be cut down to ${
                alteredContainerDimensions.length
            }x${alteredContainerDimensions.width}x${
                alteredContainerDimensions.height - containerCutDownAmount
            } (-${containerCutDownAmount})\n`;
        }

        if (tags.WEIGHT_EXCESSIVE) {
            printText += "May need to be reinforced";
        }

        print(printText);
    };
}
