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

export default function Settings() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { boxes, setBoxes, isRunningDBTransaction } =
        useContext(GlobalContext);
    const [boxLength, setBoxLength] = useState<number>();
    const [boxWidth, setBoxWidth] = useState<number>();
    const [boxHeight, setBoxHeight] = useState<number>();
    const [prefersNoStacking, setPrefersNoStacking] = useState(false);
    const [prefersNoAdjusting, setPrefersNoAdjusting] = useState(false);
    const lInputRef = useRef<HTMLInputElement>(null);
    const wInputRef = useRef<HTMLInputElement>(null);
    const hInputRef = useRef<HTMLInputElement>(null);
    const [isBLengthInvalid, setIsBLengthInvalid] = useState(false);
    const [isBWidthInvalid, setIsBWidthInvalid] = useState(false);
    const [isBHeightInvalid, setIsBHeightInvalid] = useState(false);

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
            boxes?.some(
                (boxData) =>
                    boxData.dimensions.length === boxLength &&
                    boxData.dimensions.width === boxWidth &&
                    boxData.dimensions.height === boxHeight
            )
        ) {
            setIsBLengthInvalid(true);
            setIsBWidthInvalid(true);
            setIsBHeightInvalid(true);
        }
    }, [boxLength, boxWidth, boxHeight, boxes]);

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
                        <HStack align="stretch" mb={1}>
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
                                                    Number(e.target.value) || 1
                                                )
                                            }
                                            ref={lInputRef}
                                            onClick={() => {
                                                if (
                                                    (lInputRef.current?.value
                                                        .length ?? 0) > 0
                                                )
                                                    lInputRef.current?.select();
                                            }}
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
                                                    Number(e.target.value) || 1
                                                )
                                            }
                                            ref={wInputRef}
                                            onClick={() => {
                                                if (
                                                    (wInputRef.current?.value
                                                        .length ?? 0) > 0
                                                )
                                                    wInputRef.current?.select();
                                            }}
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
                                                    Number(e.target.value) || 1
                                                )
                                            }
                                            ref={hInputRef}
                                            onClick={() => {
                                                if (
                                                    (hInputRef.current?.value
                                                        .length ?? 0) > 0
                                                )
                                                    hInputRef.current?.select();
                                            }}
                                        />
                                    </NumberInput>
                                </FormControl>
                            </VStack>
                        </HStack>
                        <Checkbox
                            onChange={(e) =>
                                setPrefersNoStacking(e.target.checked)
                            }
                        >
                            Stacking prohibited
                        </Checkbox>
                        <br />
                        <Checkbox
                            mb={2}
                            onChange={(e) =>
                                setPrefersNoAdjusting(e.target.checked)
                            }
                        >
                            Adjusting prohibited
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
                                !boxHeight
                            }
                            onClick={() => {
                                if (
                                    !boxes ||
                                    !boxLength ||
                                    !boxWidth ||
                                    !boxHeight
                                )
                                    return;

                                setBoxes([
                                    ...boxes,
                                    {
                                        meta: {
                                            preferNoStack: prefersNoStacking,
                                            preferNoAdjust: prefersNoAdjusting,
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
                                return (
                                    a.dimensions.length - b.dimensions.length
                                );
                            })
                            .map((box) => (
                                <HStack
                                    key={`${box.dimensions.length}x${box.dimensions.width}x${box.dimensions.height}`}
                                    py={2}
                                    borderTopWidth="thin"
                                >
                                    <Text fontWeight="bold">
                                        {box.dimensions.length}x
                                        {box.dimensions.width}x
                                        {box.dimensions.height}{" "}
                                        {box.meta.preferNoStack && (
                                            <Badge colorScheme="red">
                                                No stacking
                                            </Badge>
                                        )}{" "}
                                        {box.meta.preferNoAdjust && (
                                            <Badge colorScheme="red">
                                                No adjusting
                                            </Badge>
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
