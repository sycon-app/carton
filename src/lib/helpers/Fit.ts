import type { BoxDimensions } from "lib/structs/BoxDimensions";
import type { ItemAttributes } from "lib/structs/ItemAttributes";
import { volume } from "lib/util/dimensions";

import { BoxItem } from "./BoxItem";

const SCORE_PENTALTIES = {
    MODIFICATIONS_STACKED: 70,
    MODIFICATIONS_ADJUSTED: 60,
    WEIGHT_LOW: 60,
    WEIGHT_ACCEPTABLE: 40,
    WEIGHT_EXCESSIVE: 80,
    VOIDSPACE_EXCESSIVE: 1,
};

export interface FitData {
    score: number;
    id: string;
    item: ItemAttributes;
    isItemRotated: boolean;
    unalteredContainerDimensions: BoxDimensions;
    alteredContainerDimensions: BoxDimensions;
    containerWeightRating: number;
    containerCutDownAmount: number;
    containerStackCount: number;
    containerAdjustAmount: number;
    volume: number;
    invalid: boolean;
    tags: {
        MODIFICATIONS_STACKED?: boolean;
        MODIFICATIONS_ADJUSTED?: boolean;
        WEGHT_LOW?: boolean;
        WEIGHT_ACCEPTABLE?: boolean;
        WEIGHT_EXCESSIVE?: boolean;
        VOIDSPACE_EXCESSIVE?: boolean;
    };
}

export class Fit {
    private data: FitData;

    private constructor(data: FitData) {
        this.data = data;
    }

    private makeItem() {
        return new BoxItem(
            this.data.item.dimensions,
            this.data.item.padding,
            this.data.item.weight
        );
    }

    static sortFunction(a: FitData, b: FitData) {
        if (a.score === b.score) {
            return a.volume - b.volume;
        }

        return a.score - b.score;
    }

    static from(data: FitData) {
        return new Fit(data);
    }

    static performIfValid(data: FitData, callback: (data: FitData) => void) {
        if (data.invalid) return;

        callback(data);
    }

    valid() {
        this.data.invalid = false;

        return this;
    }

    tag(name: keyof FitData["tags"], value = true) {
        this.data.tags[name] = value;

        return this;
    }

    penalty(type: keyof typeof SCORE_PENTALTIES, multiplier = 1) {
        this.data.score += SCORE_PENTALTIES[type] * multiplier;

        return this;
    }

    weightPenalty(accepableWeightMargin = 10) {
        if (this.data.item.weight > this.data.containerWeightRating) {
            if (
                this.data.item.weight >
                this.data.containerWeightRating + accepableWeightMargin
            ) {
                const marginsOverAbsoluteLimit = Math.ceil(
                    (this.data.item.weight -
                        (this.data.containerWeightRating +
                            accepableWeightMargin)) /
                        accepableWeightMargin
                );
                return this.penalty(
                    "WEIGHT_EXCESSIVE",
                    marginsOverAbsoluteLimit
                ).tag("WEIGHT_EXCESSIVE");
            }

            return this.penalty("WEIGHT_ACCEPTABLE").tag("WEIGHT_ACCEPTABLE");
        }

        if (
            this.data.item.weight <
            this.data.containerWeightRating - accepableWeightMargin * 2
        ) {
            const marginsBelowRecommendedCeiling = Math.ceil(
                (this.data.containerWeightRating -
                    accepableWeightMargin -
                    this.data.item.weight) /
                    accepableWeightMargin
            );

            return this.penalty("WEIGHT_LOW", marginsBelowRecommendedCeiling);
        }

        return this;
    }

    voidSpacePenalty() {
        const voidSpaceDiff =
            volume(this.data.alteredContainerDimensions) -
            volume(this.data.item.dimensions);

        if (voidSpaceDiff < 1000) return this;

        const voidSpaceRatio = Math.floor(
            voidSpaceDiff /
                (this.data.item.dimensions.length *
                    this.data.item.dimensions.width)
        );

        if (voidSpaceRatio >= 1) {
            return this.penalty("VOIDSPACE_EXCESSIVE", voidSpaceRatio).tag(
                "VOIDSPACE_EXCESSIVE"
            );
        }

        return this;
    }

    rotateItem(method: "LONG_SIDE" | "SHORT_SIDE") {
        this.data.isItemRotated = true;

        const rotatedLength =
            method === "SHORT_SIDE"
                ? this.data.item.dimensions.height
                : this.data.item.dimensions.length;
        const rotatedWidth =
            method === "LONG_SIDE"
                ? this.data.item.dimensions.height
                : this.data.item.dimensions.width;
        const rotatedHeight =
            method === "SHORT_SIDE"
                ? this.data.item.dimensions.length
                : this.data.item.dimensions.width;

        this.data.item.dimensions.length =
            rotatedLength >= rotatedWidth ? rotatedLength : rotatedWidth;
        this.data.item.dimensions.width =
            rotatedLength >= rotatedWidth ? rotatedWidth : rotatedLength;
        this.data.item.dimensions.height = rotatedHeight;

        return this;
    }

    cutDownToFitItem(isNotSuggestion = false) {
        this.data.containerCutDownAmount =
            this.data.alteredContainerDimensions.height -
            this.makeItem().dimensionsWithPadding.height;

        if (isNotSuggestion) {
            this.data.alteredContainerDimensions.height -=
                this.data.containerCutDownAmount;

            this.data.volume = volume(this.data.alteredContainerDimensions);
        }

        return this;
    }

    stackToFitItem() {
        const count = Math.ceil(
            this.makeItem().dimensionsWithPadding.height /
                this.data.unalteredContainerDimensions.height
        );

        this.data.containerStackCount = count;

        this.data.alteredContainerDimensions.height =
            this.data.unalteredContainerDimensions.height * count;

        this.data.volume = volume(this.data.alteredContainerDimensions);

        return this.penalty("MODIFICATIONS_STACKED", count - 1).tag(
            "MODIFICATIONS_STACKED"
        );
    }

    adjustToFitItem() {
        this.data.containerAdjustAmount =
            this.makeItem().dimensionsWithPadding.length -
            this.data.unalteredContainerDimensions.length;

        this.data.alteredContainerDimensions.length =
            this.data.unalteredContainerDimensions.length +
            this.data.containerAdjustAmount;
        this.data.alteredContainerDimensions.width =
            this.data.unalteredContainerDimensions.width -
            this.data.containerAdjustAmount;

        return this.penalty("MODIFICATIONS_ADJUSTED").tag(
            "MODIFICATIONS_ADJUSTED"
        );
    }

    result() {
        this.data.id =
            // eslint-disable-next-line prefer-template
            "" +
            this.data.unalteredContainerDimensions.length +
            "." +
            this.data.unalteredContainerDimensions.width +
            "." +
            this.data.unalteredContainerDimensions.height +
            "-" +
            this.data.alteredContainerDimensions.length +
            "." +
            this.data.alteredContainerDimensions.width +
            "." +
            this.data.alteredContainerDimensions.height;

        return this.cutDownToFitItem().weightPenalty(10).voidSpacePenalty()
            .data;
    }
}
