import type { BoxDimensions } from "lib/structs/BoxDimensions";

export function volume(dimensions: BoxDimensions) {
    return dimensions.length * dimensions.width * dimensions.height;
}

export function dimensionsAreSame(
    dimensions1: BoxDimensions,
    dimensions2: BoxDimensions
) {
    return (
        dimensions1.length === dimensions2.length &&
        dimensions1.width === dimensions2.width &&
        dimensions1.height === dimensions2.height
    );
}
