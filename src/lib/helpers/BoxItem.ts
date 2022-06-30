import type { BoxData } from "lib/structs/BoxData";
import type { BoxDimensions } from "lib/structs/BoxDimensions";
import type { ItemAttributes } from "lib/structs/ItemAttributes";

export class BoxItem {
    private dimensions: BoxDimensions;

    private padding: number;

    private weight: number;

    constructor(dimensions: BoxDimensions, padding = 0, weight = 0) {
        this.dimensions = dimensions;
        this.padding = padding;
        this.weight = weight;
    }

    get attributes(): ItemAttributes {
        return {
            dimensions: this.dimensions,
            padding: this.padding,
            weight: this.weight,
        };
    }

    get dimensionsWithPadding(): BoxDimensions {
        return {
            length: this.dimensions.length + this.padding * 2,
            width: this.dimensions.width + this.padding * 2,
            height: this.dimensions.height + this.padding * 2,
        };
    }

    get volume(): number {
        const { length, width, height } = this.dimensionsWithPadding;

        return length * width * height;
    }

    rotate(method: "LONG_SIDE" | "SHORT_SIDE") {
        const rotatedLength =
            method === "SHORT_SIDE"
                ? this.dimensions.height
                : this.dimensions.length;
        const rotatedWidth =
            method === "LONG_SIDE"
                ? this.dimensions.height
                : this.dimensions.width;
        const rotatedHeight =
            method === "SHORT_SIDE"
                ? this.dimensions.length
                : this.dimensions.width;

        return new BoxItem(
            {
                length:
                    rotatedLength >= rotatedWidth
                        ? rotatedLength
                        : rotatedWidth,
                width:
                    rotatedLength >= rotatedWidth
                        ? rotatedWidth
                        : rotatedLength,
                height: rotatedHeight,
            },
            this.padding,
            this.weight
        );
    }

    fitsXZ(container: BoxData, allowAdjust = false) {
        const { length: containerLength, width: containerWidth } =
            container.dimensions;

        if (allowAdjust) {
            return (
                this.dimensionsWithPadding.length +
                    this.dimensionsWithPadding.width <=
                containerLength + containerWidth
            );
        }

        return (
            this.dimensionsWithPadding.length <= containerLength &&
            this.dimensionsWithPadding.width <= containerWidth
        );
    }

    fitsXYZ(container: BoxData, allowAdjust = false) {
        return (
            this.fitsXZ(container, allowAdjust) &&
            this.dimensionsWithPadding.height <= container.dimensions.height
        );
    }

    potentialCutDownAmountFor(container: BoxData, containerStackCount = 1) {
        return (
            container.dimensions.height * containerStackCount -
            this.dimensionsWithPadding.height
        );
    }

    requiredStackCountToFitInside(container: BoxData) {
        return Math.ceil(
            this.dimensionsWithPadding.height / container.dimensions.height
        );
    }

    requireAdjustmentAmountToFitInside(container: BoxData) {
        if (this.fitsXZ(container)) return 0;

        return this.dimensionsWithPadding.length - container.dimensions.length;
    }
}
