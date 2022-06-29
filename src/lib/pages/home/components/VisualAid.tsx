import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";

import type { BoxDimensions } from "lib/structs/BoxDimensions";

function Cube({
    length,
    width,
    height,
    color,
    opacity,
    wireframe,
}: {
    length: number;
    width: number;
    height: number;
    color: string;
    opacity?: number;
    wireframe?: boolean;
}) {
    return (
        <>
            <boxGeometry args={[length, height, width]} />
            <meshToonMaterial
                color={color}
                opacity={opacity ?? 1}
                transparent={opacity !== undefined}
                wireframe={wireframe}
            />
        </>
    );
}

export default function VisualAid({
    item,
    container,
    padding,
}: {
    item?: Partial<BoxDimensions>;
    container?: Partial<BoxDimensions>;
    padding: number;
}) {
    const getNormalized: () => {
        item: BoxDimensions;
        itemWithPadding: BoxDimensions;
        container: BoxDimensions;
        // eslint-disable-next-line sonarjs/cognitive-complexity
    } = () => {
        const itemDims: BoxDimensions = {
            length: item?.length ?? 1,
            width: item?.width ?? 1,
            height: item?.height ?? 1,
        };
        const itemWithPaddingDims: BoxDimensions = {
            length: (item?.length ?? 1) + padding * 2,
            width: (item?.width ?? 1) + padding * 2,
            height: (item?.height ?? 1) + padding * 2,
        };
        const containerDims: BoxDimensions = {
            length: container?.length ?? 0,
            width: container?.width ?? 0,
            height: container?.height ?? 0,
        };

        if (itemDims.width > itemDims.length) {
            return {
                item: {
                    length: 0,
                    width: 0,
                    height: 0,
                },
                itemWithPadding: {
                    length: 0,
                    width: 0,
                    height: 0,
                },
                container: {
                    length: 0,
                    width: 0,
                    height: 0,
                },
            };
        }

        let compareTarget: BoxDimensions;
        if (
            !containerDims.length ||
            !containerDims.width ||
            !containerDims.height
        )
            compareTarget = itemDims;
        else compareTarget = containerDims;

        let largestDim = 0;
        if (compareTarget.length > largestDim)
            largestDim = compareTarget.length;
        if (compareTarget.width > largestDim) largestDim = compareTarget.width;
        if (compareTarget.height > largestDim)
            largestDim = compareTarget.height;

        return {
            item: {
                length: itemDims.length / largestDim,
                width: itemDims.width / largestDim,
                height: itemDims.height / largestDim,
            },
            itemWithPadding: {
                length: itemWithPaddingDims.length / largestDim,
                width: itemWithPaddingDims.width / largestDim,
                height: itemWithPaddingDims.height / largestDim,
            },
            container: {
                length: containerDims.length / largestDim,
                width: containerDims.width / largestDim,
                height: containerDims.height / largestDim,
            },
        };
    };

    const normalizedItemDimensions = useMemo(getNormalized, [
        item,
        container,
        padding,
    ]);

    return (
        <Canvas
            camera={{
                fov: 60,
                near: 0.1,
                far: 1000,
                position: [-1.7, 1.8, 2.5],
            }}
        >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <mesh scale={2} position={[0, 0, 0]}>
                <Cube
                    length={normalizedItemDimensions.container.length + 0.001}
                    width={normalizedItemDimensions.container.width + 0.001}
                    height={normalizedItemDimensions.container.height + 0.001}
                    color="red"
                    opacity={0.45}
                />
            </mesh>
            <mesh scale={2} position={[0, 0, 0]}>
                <Cube
                    length={
                        padding
                            ? normalizedItemDimensions.itemWithPadding.length
                            : 0
                    }
                    width={
                        padding
                            ? normalizedItemDimensions.itemWithPadding.width
                            : 0
                    }
                    height={
                        padding
                            ? normalizedItemDimensions.itemWithPadding.height
                            : 0
                    }
                    color="blue"
                    wireframe
                />
            </mesh>
            <mesh scale={2} position={[0, 0, 0]}>
                <Cube
                    length={normalizedItemDimensions.item.length}
                    width={normalizedItemDimensions.item.width}
                    height={normalizedItemDimensions.item.height}
                    color="white"
                />
            </mesh>
            <gridHelper
                args={[4, (container?.length ?? 2) / 2, 0x2d3748, 0x2d3748]}
                position={[
                    0,
                    -1 * normalizedItemDimensions.container.height + 0.001,
                    0,
                ]}
            />
            <gridHelper
                args={[4, (container?.length ?? 2) / 2, 0x2c5282, 0x2c5282]}
                position={[
                    2,
                    2 - (normalizedItemDimensions.container.height + 0.001),
                    0,
                ]}
                rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]}
            />
            <gridHelper
                args={[4, (container?.length ?? 2) / 2, 0x9b2c2c, 0x9b2c2c]}
                position={[
                    0,
                    2 - (normalizedItemDimensions.container.height + 0.001),
                    -2,
                ]}
                rotation={[Math.PI * 0.5, 0, Math.PI]}
            />
        </Canvas>
    );
}
