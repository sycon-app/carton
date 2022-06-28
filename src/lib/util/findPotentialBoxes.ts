/* eslint-disable complexity */
/* eslint-disable no-restricted-syntax */
import type { BoxDimensions } from "lib/structs/BoxDimensions";
import type { FitResult } from "lib/structs/FitResult";

function rotateDimensions(dimensions: BoxDimensions): BoxDimensions {
    const rotatedLength = dimensions.height;
    const rotatedWidth = dimensions.width;
    const rotatedHeight = dimensions.length;

    return {
        length: rotatedLength >= rotatedWidth ? rotatedLength : rotatedWidth,
        width: rotatedLength >= rotatedWidth ? rotatedWidth : rotatedLength,
        height: rotatedHeight,
    };
}

// Assume length is always greater or equal to width
// eslint-disable-next-line sonarjs/cognitive-complexity
export function findFits(
    methods: ("AS_IS" | "STACK" | "MODIFY" | "MODIFY_AND_STACK" | "ROTATE")[],
    dimensions: BoxDimensions,
    availableBoxes: BoxDimensions[],
    padding = 0
) {
    const valid: FitResult[] = [];

    let adjustedItemDimensions: BoxDimensions;
    if (methods.includes("ROTATE")) {
        adjustedItemDimensions = rotateDimensions(dimensions);
    } else {
        adjustedItemDimensions = dimensions;
    }

    const dimensionsWithPadding: BoxDimensions = {
        length: adjustedItemDimensions.length + padding * 2,
        width: adjustedItemDimensions.width + padding * 2,
        height: adjustedItemDimensions.height + padding * 2,
    };

    // eslint-disable-next-line guard-for-in
    for (let i = 0; i < availableBoxes.length; i += 1) {
        const box = availableBoxes[i];

        const boxVolume = box.length * box.width * box.height;

        const boxFitsLength = box.length >= dimensionsWithPadding.length;
        const boxFitsWidth = box.width >= dimensionsWithPadding.width;
        const boxFitsHeight = box.height >= dimensionsWithPadding.height;
        const boxFitsLengthAndWidthWhenModified =
            box.length + box.width >=
            dimensionsWithPadding.width + dimensionsWithPadding.length;

        const canFitEasy = boxFitsLength && boxFitsWidth && boxFitsHeight;
        const canFitStacked = boxFitsLength && boxFitsWidth;
        const canFitModified =
            boxFitsLengthAndWidthWhenModified && boxFitsHeight;
        const canFitModifiedAndStacked = boxFitsLengthAndWidthWhenModified;

        if (methods.includes("AS_IS") && canFitEasy) {
            valid.push({
                item: adjustedItemDimensions,
                itemWithPadding: dimensionsWithPadding,
                isItemRotated: methods.includes("ROTATE"),
                unalteredDimensions: box,
                alteredDimensions: box,
                volume: boxVolume,
                stackCount: 1,
            });
        } else if (methods.includes("STACK") && !canFitEasy && canFitStacked) {
            valid.push({
                item: adjustedItemDimensions,
                itemWithPadding: dimensionsWithPadding,
                isItemRotated: methods.includes("ROTATE"),
                unalteredDimensions: box,
                alteredDimensions: {
                    ...box,
                    height:
                        box.height *
                        Math.ceil(dimensionsWithPadding.height / box.height),
                },
                volume:
                    boxVolume *
                    Math.ceil(dimensionsWithPadding.height / box.height),
                stackCount: Math.ceil(
                    dimensionsWithPadding.height / box.height
                ),
            });
        } else if (
            methods.includes("MODIFY") &&
            !canFitEasy &&
            !canFitStacked &&
            canFitModified
        ) {
            const adjustmentAmount = dimensionsWithPadding.length - box.length;
            const modifiedBoxDimensions: BoxDimensions = {
                length: box.length + adjustmentAmount,
                width: box.width - adjustmentAmount,
                height: box.height,
            };

            valid.push({
                item: adjustedItemDimensions,
                itemWithPadding: dimensionsWithPadding,
                isItemRotated: methods.includes("ROTATE"),
                unalteredDimensions: box,
                alteredDimensions: modifiedBoxDimensions,
                volume: boxVolume,
                stackCount: 1,
            });
        } else if (
            methods.includes("MODIFY_AND_STACK") &&
            !canFitEasy &&
            !canFitStacked &&
            !canFitModified &&
            canFitModifiedAndStacked
        ) {
            const adjustmentAmount = dimensionsWithPadding.length - box.length;
            const modifiedBoxDimensions: BoxDimensions = {
                length: box.length + adjustmentAmount,
                width: box.width - adjustmentAmount,
                height:
                    box.height *
                    Math.ceil(dimensionsWithPadding.height / box.height),
            };

            valid.push({
                item: adjustedItemDimensions,
                itemWithPadding: dimensionsWithPadding,
                isItemRotated: methods.includes("ROTATE"),
                unalteredDimensions: box,
                alteredDimensions: modifiedBoxDimensions,
                volume:
                    boxVolume *
                    Math.ceil(dimensionsWithPadding.height / box.height),
                stackCount: Math.ceil(
                    dimensionsWithPadding.height / box.height
                ),
            });
        }
    }

    return valid;
}