/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
import { AddIcon, MinusIcon, SettingsIcon } from "@chakra-ui/icons";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Text,
    IconButton,
    useDisclosure,
    Spinner,
    FormControl,
    FormLabel,
    HStack,
    NumberInput,
    NumberInputField,
    Spacer,
    VStack,
    Button,
    Checkbox,
    Badge,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";

import { GlobalContext } from "lib/context/global";
import { volume } from "lib/util/dimensions";
import { selectInput } from "lib/util/selectInput";

export default function Settings() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { boxes, setBoxes, isRunningDBTransaction } =
        useContext(GlobalContext);
    const [boxLength, setBoxLength] = useState<number>();
    const [boxWidth, setBoxWidth] = useState<number>();
    const [boxHeight, setBoxHeight] = useState<number>();
    const [weightRating, setWeightRating] = useState<number>();
    const [prefersNoStacking, setPrefersNoStacking] = useState(false);
    const [prefersNoAdjusting, setPrefersNoAdjusting] = useState(false);
    const lInputRef = useRef<HTMLInputElement>(null);
    const wInputRef = useRef<HTMLInputElement>(null);
    const hInputRef = useRef<HTMLInputElement>(null);
    const weightInputRef = useRef<HTMLInputElement>(null);
    const [isBLengthInvalid, setIsBLengthInvalid] = useState(false);
    const [isBWidthInvalid, setIsBWidthInvalid] = useState(false);
    const [isBHeightInvalid, setIsBHeightInvalid] = useState(false);
    const [isWeightRatingInvalid, setIsWeightRatingInvalid] = useState(false);

    useEffect(() => {
        if (
            boxLength !== undefined &&
            (boxLength <= 0 || boxLength % 1 !== 0)
        ) {
            setIsBLengthInvalid(true);
        } else {
            setIsBLengthInvalid(false);
        }

        if (
            boxWidth !== undefined &&
            (boxWidth <= 0 ||
                boxWidth % 1 !== 0 ||
                (boxLength && boxWidth > boxLength))
        ) {
            setIsBWidthInvalid(true);
        } else {
            setIsBWidthInvalid(false);
        }

        if (
            boxHeight !== undefined &&
            (boxHeight <= 0 || boxHeight % 1 !== 0)
        ) {
            setIsBHeightInvalid(true);
        } else {
            setIsBHeightInvalid(false);
        }

        if (
            weightRating !== undefined &&
            (weightRating <= 0 || weightRating % 1 !== 0)
        ) {
            setIsWeightRatingInvalid(true);
        } else {
            setIsWeightRatingInvalid(false);
        }

        if (
            boxes?.some(
                (boxData) =>
                    boxData.meta._id ===
                    `${boxData.dimensions.length}.${boxData.dimensions.width}.${boxData.dimensions.height}-${boxData.meta.weightRating}`
            )
        ) {
            setIsBLengthInvalid(true);
            setIsBWidthInvalid(true);
            setIsBHeightInvalid(true);
            setIsWeightRatingInvalid(true);
        }
    }, [boxLength, boxWidth, boxHeight, weightRating, boxes]);

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size="sm"
                allowPinchZoom
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        Manage available boxes{" "}
                        <Spinner hidden={!isRunningDBTransaction} size="sm" />
                    </DrawerHeader>

                    <DrawerBody>
                        <HStack align="stretch" mb={4}>
                            <VStack align="start">
                                <FormControl isInvalid={isBLengthInvalid}>
                                    <FormLabel
                                        fontWeight="bold"
                                        fontSize="xs"
                                        textTransform="uppercase"
                                        htmlFor="blength"
                                    >
                                        Length
                                    </FormLabel>
                                    <NumberInput
                                        size="sm"
                                        id="blength"
                                        value={boxLength}
                                    >
                                        <NumberInputField
                                            p={4}
                                            placeholder="Length"
                                            color={
                                                isBLengthInvalid
                                                    ? "red.500"
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                setBoxLength(
                                                    Number(e.target.value) || 0
                                                )
                                            }
                                            ref={lInputRef}
                                            onClick={() =>
                                                selectInput(lInputRef)
                                            }
                                        />
                                    </NumberInput>
                                </FormControl>
                            </VStack>
                            <VStack>
                                <Spacer />
                                <Text pb={2}>x</Text>
                            </VStack>
                            <VStack align="start">
                                <FormControl isInvalid={isBWidthInvalid}>
                                    <FormLabel
                                        fontWeight="bold"
                                        fontSize="xs"
                                        textTransform="uppercase"
                                        htmlFor="bwidth"
                                    >
                                        Width
                                    </FormLabel>
                                    <NumberInput
                                        size="sm"
                                        id="bwidth"
                                        value={boxWidth}
                                    >
                                        <NumberInputField
                                            p={4}
                                            placeholder="Width"
                                            color={
                                                isBWidthInvalid
                                                    ? "red.500"
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                setBoxWidth(
                                                    Number(e.target.value) || 0
                                                )
                                            }
                                            ref={wInputRef}
                                            onClick={() =>
                                                selectInput(wInputRef)
                                            }
                                        />
                                    </NumberInput>
                                </FormControl>
                            </VStack>
                            <VStack>
                                <Spacer />
                                <Text pb={2}>x</Text>
                            </VStack>
                            <VStack align="start">
                                <FormControl isInvalid={isBHeightInvalid}>
                                    <FormLabel
                                        fontWeight="bold"
                                        fontSize="xs"
                                        textTransform="uppercase"
                                        htmlFor="bheight"
                                    >
                                        Height
                                    </FormLabel>
                                    <NumberInput
                                        size="sm"
                                        id="bheight"
                                        value={boxHeight}
                                    >
                                        <NumberInputField
                                            p={4}
                                            placeholder="Height"
                                            color={
                                                isBHeightInvalid
                                                    ? "red.500"
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                setBoxHeight(
                                                    Number(e.target.value) || 0
                                                )
                                            }
                                            ref={hInputRef}
                                            onClick={() =>
                                                selectInput(hInputRef)
                                            }
                                        />
                                    </NumberInput>
                                </FormControl>
                            </VStack>
                        </HStack>
                        <FormControl isInvalid={isWeightRatingInvalid} mb={2}>
                            <FormLabel
                                fontWeight="bold"
                                fontSize="xs"
                                textTransform="uppercase"
                                htmlFor="weightrating"
                            >
                                Max content weight
                            </FormLabel>
                            <NumberInput
                                size="sm"
                                id="weightrating"
                                value={weightRating}
                            >
                                <NumberInputField
                                    p={4}
                                    placeholder="Weight rating"
                                    color={
                                        isBHeightInvalid ? "red.500" : undefined
                                    }
                                    onChange={(e) =>
                                        setWeightRating(
                                            Number(e.target.value) || 0
                                        )
                                    }
                                    ref={weightInputRef}
                                    onClick={() => selectInput(weightInputRef)}
                                />
                            </NumberInput>
                        </FormControl>
                        <Checkbox
                            onChange={(e) =>
                                setPrefersNoStacking(e.target.checked)
                            }
                        >
                            Prefer no stacking
                        </Checkbox>
                        <br />
                        <Checkbox
                            mb={2}
                            onChange={(e) =>
                                setPrefersNoAdjusting(e.target.checked)
                            }
                        >
                            Prefer no adjusting
                        </Checkbox>
                        <Button
                            w="full"
                            size="sm"
                            leftIcon={<AddIcon />}
                            mb={4}
                            isDisabled={
                                isBLengthInvalid ||
                                isBWidthInvalid ||
                                isBHeightInvalid ||
                                !boxLength ||
                                !boxWidth ||
                                !boxHeight ||
                                !weightRating
                            }
                            onClick={() => {
                                if (
                                    !boxes ||
                                    !boxLength ||
                                    !boxWidth ||
                                    !boxHeight ||
                                    !weightRating
                                )
                                    return;

                                setBoxes([
                                    ...boxes,
                                    {
                                        meta: {
                                            _id: `${boxLength}.${boxWidth}.${boxHeight}-${weightRating}`,
                                            preferNoStack: prefersNoStacking,
                                            preferNoAdjust: prefersNoAdjusting,
                                            weightRating:
                                                weightRating ?? Infinity,
                                        },
                                        dimensions: {
                                            length: boxLength,
                                            width: boxWidth,
                                            height: boxHeight,
                                        },
                                    },
                                ]);

                                setBoxWidth(0);
                                setBoxLength(0);
                                setBoxHeight(0);
                                setWeightRating(0);
                            }}
                        >
                            Add
                        </Button>
                        {!boxes && (
                            <Text
                                backgroundColor="yellow.100"
                                color="yellow.800"
                                p={4}
                                borderRadius="md"
                            >
                                First load detected. Reload the page to use the
                                settings panel. If this message is unexpected,
                                please file a bug report.
                            </Text>
                        )}
                        {boxes
                            ?.sort((a, b) => {
                                if (
                                    a.dimensions.length === b.dimensions.length
                                ) {
                                    return (
                                        volume(a.dimensions) -
                                        volume(b.dimensions)
                                    );
                                }

                                return (
                                    a.dimensions.length - b.dimensions.length
                                );
                            })
                            .map((box) => (
                                <HStack
                                    key={box.meta._id}
                                    py={2}
                                    borderTopWidth="thin"
                                >
                                    <Text fontWeight="bold">
                                        {box.dimensions.length}x
                                        {box.dimensions.width}x
                                        {box.dimensions.height}{" "}
                                        <Badge colorScheme="blue">
                                            Weight rating:{" "}
                                            {box.meta.weightRating}
                                        </Badge>
                                        {(box.meta.preferNoAdjust ||
                                            box.meta.preferNoStack) && (
                                            <>
                                                <br />
                                                {box.meta.preferNoStack && (
                                                    <Badge colorScheme="red">
                                                        No stacking
                                                    </Badge>
                                                )}
                                                {box.meta.preferNoAdjust && (
                                                    <Badge colorScheme="red">
                                                        No adjusting
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                    </Text>
                                    <Spacer />
                                    <IconButton
                                        variant="ghost"
                                        colorScheme="red"
                                        size="sm"
                                        aria-label="Remove"
                                        icon={<MinusIcon />}
                                        onClick={() => {
                                            setBoxes(
                                                boxes.filter(
                                                    (searchBox) =>
                                                        searchBox !== box
                                                )
                                            );
                                        }}
                                    />
                                </HStack>
                            ))}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <IconButton
                aria-label="Settings"
                icon={<SettingsIcon />}
                size="sm"
                onClick={onOpen}
            />
        </>
    );
}
