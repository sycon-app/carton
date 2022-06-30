/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import type { BoxData } from "lib/structs/BoxData";
import type { BoxDimensions } from "lib/structs/BoxDimensions";
import { volume } from "lib/util/dimensions";

import { BoxItem } from "./BoxItem";
import { Fit } from "./Fit";
import type { FitData } from "./Fit";

export function fits(
    item: BoxDimensions,
    availableContainers: BoxData[],
    padding?: number,
    weight?: number
) {
    const boxItem = new BoxItem(item, padding, weight);
    const results: FitData[] = [];

    for (let i = 0; i < availableContainers.length; i += 1) {
        const container = availableContainers[i];
        const currentFitTemplate: FitData = {
            score: 0,
            id: "",
            item: {
                dimensions: { ...boxItem.attributes.dimensions },
                padding: boxItem.attributes.padding,
                weight: boxItem.attributes.weight,
            },
            isItemRotated: false,
            unalteredContainerDimensions: { ...container.dimensions },
            alteredContainerDimensions: { ...container.dimensions },
            containerWeightRating: container.meta.weightRating,
            containerCutDownAmount: 0,
            containerStackCount: 1,
            containerAdjustAmount: 0,
            volume: volume(container.dimensions),
            invalid: true,
            tags: {},
        };

        const currentFitOptions: FitData[] = [];

        // Test easy fit - no modifications needed
        if (boxItem.fitsXYZ(container)) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (boxItem.rotate("LONG_SIDE").fitsXYZ(container)) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("LONG_SIDE")
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (boxItem.rotate("SHORT_SIDE").fitsXYZ(container)) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("SHORT_SIDE")
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }

        // Test stack fit
        if (!container.meta.preferNoStack && boxItem.fitsXZ(container)) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .stackToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (
            !container.meta.preferNoStack &&
            boxItem.rotate("LONG_SIDE").fitsXZ(container)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("LONG_SIDE")
                    .stackToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (
            !container.meta.preferNoStack &&
            boxItem.rotate("SHORT_SIDE").fitsXZ(container)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("SHORT_SIDE")
                    .stackToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }

        // Test adjustment fit
        if (
            !container.meta.preferNoAdjust &&
            boxItem.fitsXYZ(container, true)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .adjustToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (
            !container.meta.preferNoAdjust &&
            boxItem.rotate("LONG_SIDE").fitsXYZ(container, true)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("LONG_SIDE")
                    .adjustToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (
            !container.meta.preferNoAdjust &&
            boxItem.rotate("SHORT_SIDE").fitsXYZ(container, true)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("SHORT_SIDE")
                    .adjustToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }

        // Test complex fit - adjustment and stacking
        if (
            !container.meta.preferNoStack &&
            !container.meta.preferNoAdjust &&
            boxItem.fitsXZ(container, true)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .stackToFitItem()
                    .adjustToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (
            !container.meta.preferNoStack &&
            !container.meta.preferNoAdjust &&
            boxItem.rotate("LONG_SIDE").fitsXZ(container, true)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("LONG_SIDE")
                    .stackToFitItem()
                    .adjustToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }
        if (
            !container.meta.preferNoStack &&
            !container.meta.preferNoAdjust &&
            boxItem.rotate("SHORT_SIDE").fitsXZ(container, true)
        ) {
            Fit.performIfValid(
                Fit.from(JSON.parse(JSON.stringify(currentFitTemplate)))
                    .rotateItem("SHORT_SIDE")
                    .stackToFitItem()
                    .adjustToFitItem()
                    .valid()
                    .result(),
                (data) => currentFitOptions.push(data)
            );
        }

        results.push(...currentFitOptions);
    }

    const uniqueResults: FitData[] = [];
    results.sort(Fit.sortFunction).forEach((result) => {
        if (
            uniqueResults.some((uniqueResult) => uniqueResult.id === result.id)
        ) {
            return;
        }

        uniqueResults.push(result);
    });

    return uniqueResults;
}
