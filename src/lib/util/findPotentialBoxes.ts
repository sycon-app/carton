/* eslint-disable complexity */
/* eslint-disable no-restricted-syntax */
import type { BoxData } from "lib/structs/BoxData";
import type { BoxDimensions } from "lib/structs/BoxDimensions";
import type { FitResult } from "lib/structs/FitResult";

function rotateDimensions(
    dimensions: BoxDimensions,
    method: "LENGTHWISE" | "WIDTHWISE"
): BoxDimensions {
    const rotatedLength =
        method === "LENGTHWISE" ? dimensions.height : dimensions.length;
    const rotatedWidth =
        method === "WIDTHWISE" ? dimensions.height : dimensions.width;
    const rotatedHeight =
        method === "LENGTHWISE" ? dimensions.length : dimensions.width;

    return {
        length: rotatedLength >= rotatedWidth ? rotatedLength : rotatedWidth,
        width: rotatedLength >= rotatedWidth ? rotatedWidth : rotatedLength,
        height: rotatedHeight,
    };
}

export function hasExcessiveVoidSpace(fit: FitResult, factor = 1) {
    return (
        fit.alteredDimensions.length * fit.alteredDimensions.width -
            fit.itemWithPadding.length * fit.itemWithPadding.width >
        fit.itemWithPadding.length * fit.itemWithPadding.width * factor
    );
}

export function compareFits(
    fit1: FitResult,
    fit2: FitResult,
    includeKeys: (keyof FitResult)[]
) {
    const keys = (Object.keys(fit1) as (keyof FitResult)[]).filter((key) =>
        includeKeys.includes(key)
    );

    let isSame = true;

    keys.forEach((key) => {
        if (typeof fit1[key] === "object" && typeof fit2[key] === "object") {
            // BoxDimensions
            if (
                (fit1[key] as BoxDimensions).length !==
                    (fit2[key] as BoxDimensions).length ||
                (fit1[key] as BoxDimensions).width !==
                    (fit2[key] as BoxDimensions).width ||
                (fit1[key] as BoxDimensions).height !==
                    (fit2[key] as BoxDimensions).height
            ) {
                isSame = false;
            }
        } else if (fit1[key] !== fit2[key]) {
            isSame = false;
        }
    });

    return isSame;
}

// Assume length is always greater or equal to width
// eslint-disable-next-line sonarjs/cognitive-complexity
export function findFits(
    methods: (
        | "AS_IS"
        | "STACK"
        | "MODIFY"
        | "MODIFY_AND_STACK"
        | "ROTATE_LENGTHWISE"
        | "ROTATE_WIDTHWISE"
    )[],
    dimensions: BoxDimensions,
    availableBoxData: BoxData[],
    padding = 0
) {
    const valid: FitResult[] = [];

    let adjustedItemDimensions: BoxDimensions;
    if (methods.includes("ROTATE_LENGTHWISE")) {
        adjustedItemDimensions = rotateDimensions(dimensions, "LENGTHWISE");
    } else if (methods.includes("ROTATE_WIDTHWISE")) {
        adjustedItemDimensions = rotateDimensions(dimensions, "WIDTHWISE");
    } else {
        adjustedItemDimensions = dimensions;
    }

    const dimensionsWithPadding: BoxDimensions = {
        length: adjustedItemDimensions.length + padding * 2,
        width: adjustedItemDimensions.width + padding * 2,
        height: adjustedItemDimensions.height + padding * 2,
    };

    for (let i = 0; i < availableBoxData.length; i += 1) {
        const { meta, dimensions: box } = availableBoxData[i];

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
                isItemRotated:
                    methods.includes("ROTATE_LENGTHWISE") ||
                    methods.includes("ROTATE_WIDTHWISE"),
                unalteredDimensions: box,
                alteredDimensions: box,
                volume: boxVolume,
                stackCount: 1,
            });
        } else if (
            !meta.preferNoStack &&
            methods.includes("STACK") &&
            !canFitEasy &&
            canFitStacked
        ) {
            valid.push({
                item: adjustedItemDimensions,
                itemWithPadding: dimensionsWithPadding,
                isItemRotated:
                    methods.includes("ROTATE_LENGTHWISE") ||
                    methods.includes("ROTATE_WIDTHWISE"),
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
            !meta.preferNoAdjust &&
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
                isItemRotated:
                    methods.includes("ROTATE_LENGTHWISE") ||
                    methods.includes("ROTATE_WIDTHWISE"),
                unalteredDimensions: box,
                alteredDimensions: modifiedBoxDimensions,
                volume: boxVolume,
                stackCount: 1,
            });
        } else if (
            !meta.preferNoStack &&
            !meta.preferNoAdjust &&
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
                isItemRotated:
                    methods.includes("ROTATE_LENGTHWISE") ||
                    methods.includes("ROTATE_WIDTHWISE"),
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
