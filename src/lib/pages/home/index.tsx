/* eslint-disable complexity */
/* eslint-disable sonarjs/no-identical-functions */
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Icon,
    IconButton,
    NumberInput,
    NumberInputField,
    Select,
    Spacer,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MdPrint } from "react-icons/md";

import { GlobalContext } from "lib/context/global";
import type { BoxData } from "lib/structs/BoxData";
import type { FitResult } from "lib/structs/FitResult";
import { moveItemsToEnd } from "lib/util/array";
import { boxDefaults } from "lib/util/boxDefaults";
import { findFits, hasExcessiveVoidSpace } from "lib/util/findPotentialBoxes";
import useInstructionsPrinting from "lib/util/hooks/useInstructionsPrinting";

import Instructions from "./components/Instructions";
import VisualAid from "./components/VisualAid";

const Home = () => {
    const toast = useToast();

    const { boxes } = useContext(GlobalContext);
    const [itemLength, setItemLength] = useState(1);
    const [itemWidth, setItemWidth] = useState(1);
    const [itemHeight, setItemHeight] = useState(1);
    const [itemPadding, setItemPadding] = useState(0);
    const [fitResults, setFitResults] = useState<{
        AS_IS: FitResult[];
        STACKED: FitResult[];
        MODIFIED: FitResult[];
        MODIFIED_AND_STACKED: FitResult[];
    }>();
    const [resultMethod, setResultMethod] = useState<
        "AS_IS" | "STACKED" | "MODIFIED" | "MODIFIED_AND_STACKED"
    >("AS_IS");
    const [resultIndex, setResultIndex] = useState(0);
    const selectedFitResults = useMemo(() => {
        return fitResults?.[resultMethod] ?? [];
    }, [fitResults, resultMethod]);

    useEffect(() => {
        setResultIndex(0);

        if ((fitResults?.AS_IS.length ?? 0) > 0) setResultMethod("AS_IS");
        else if ((fitResults?.STACKED.length ?? 0) > 0)
            setResultMethod("STACKED");
        else if ((fitResults?.MODIFIED.length ?? 0) > 0)
            setResultMethod("MODIFIED");
        else if ((fitResults?.MODIFIED_AND_STACKED.length ?? 0) > 0)
            setResultMethod("MODIFIED_AND_STACKED");
        else setResultMethod("AS_IS");
    }, [fitResults]);

    useEffect(() => {
        setResultIndex(0);
    }, [resultMethod]);

    // eslint-disable-next-line sonarjs/cognitive-complexity
    useEffect(() => {
        let boxList: BoxData[];

        if (!boxes || boxes.length < 1) {
            if (!localStorage.getItem("initial_set")) {
                boxList = boxDefaults;

                toast({
                    status: "info",
                    title: "First load detected.",
                    description:
                        "Using default box list. If this message is unexpected, please file a bug report.",
                });
            } else {
                return;
            }
        } else boxList = boxes;

        if (itemWidth > itemLength) {
            setFitResults(undefined);

            return;
        }

        const easyFits = findFits(
            ["AS_IS"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxList,
            itemPadding
        );
        if (itemLength !== itemHeight || itemWidth !== itemHeight) {
            easyFits.push(
                ...findFits(
                    ["AS_IS", "ROTATE_LENGTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !easyFits.some((easyFit) =>
                            compareFits(easyFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }
        if (
            itemLength !== itemWidth &&
            (itemLength !== itemHeight || itemWidth !== itemHeight)
        ) {
            easyFits.push(
                ...findFits(
                    ["AS_IS", "ROTATE_WIDTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !easyFits.some((easyFit) =>
                            compareFits(easyFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }

        const stackFits = findFits(
            ["STACK"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxList,
            itemPadding
        );
        if (itemLength !== itemHeight || itemWidth !== itemHeight) {
            stackFits.push(
                ...findFits(
                    ["STACK", "ROTATE_LENGTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !stackFits.some((stackFit) =>
                            compareFits(stackFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }
        if (
            itemLength !== itemWidth &&
            (itemLength !== itemHeight || itemWidth !== itemHeight)
        ) {
            stackFits.push(
                ...findFits(
                    ["STACK", "ROTATE_WIDTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !stackFits.some((stackFit) =>
                            compareFits(stackFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }

        const modifyFits = findFits(
            ["MODIFY"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxList,
            itemPadding
        );
        if (itemLength !== itemHeight || itemWidth !== itemHeight) {
            modifyFits.push(
                ...findFits(
                    ["MODIFY", "ROTATE_LENGTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !modifyFits.some((modifyFit) =>
                            compareFits(modifyFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }
        if (
            itemLength !== itemWidth &&
            (itemLength !== itemHeight || itemWidth !== itemHeight)
        ) {
            modifyFits.push(
                ...findFits(
                    ["MODIFY", "ROTATE_WIDTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !modifyFits.some((modifyFit) =>
                            compareFits(modifyFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }

        const complexFits = findFits(
            ["MODIFY_AND_STACK"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxList,
            itemPadding
        );
        if (itemLength !== itemHeight || itemWidth !== itemHeight) {
            complexFits.push(
                ...findFits(
                    ["MODIFY_AND_STACK", "ROTATE_LENGTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !complexFits.some((complexFit) =>
                            compareFits(complexFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }
        if (
            itemLength !== itemWidth &&
            (itemLength !== itemHeight || itemWidth !== itemHeight)
        ) {
            complexFits.push(
                ...findFits(
                    ["MODIFY_AND_STACK", "ROTATE_WIDTHWISE"],
                    {
                        length: itemLength,
                        width: itemWidth,
                        height: itemHeight,
                    },
                    boxList,
                    itemPadding
                ) /* .filter(
                    (fit) =>
                        !complexFits.some((complexFit) =>
                            compareFits(complexFit, fit, [
                                "alteredDimensions",
                                "stackCount",
                                "unalteredDimensions",
                            ])
                        )
                ) */
            );
        }

        setFitResults({
            AS_IS: moveItemsToEnd(
                easyFits.sort((a, b) => a.volume - b.volume),
                (fit) => hasExcessiveVoidSpace(fit)
            ),
            STACKED: moveItemsToEnd(
                stackFits.sort((a, b) => {
                    if (a.stackCount === b.stackCount) {
                        return a.volume - b.volume;
                    }

                    return a.stackCount - b.stackCount;
                }),
                (fit) => hasExcessiveVoidSpace(fit)
            ),
            MODIFIED: moveItemsToEnd(
                modifyFits.sort((a, b) => a.volume - b.volume),
                (fit) => hasExcessiveVoidSpace(fit)
            ),
            MODIFIED_AND_STACKED: moveItemsToEnd(
                complexFits.sort((a, b) => {
                    if (a.stackCount === b.stackCount) {
                        return a.volume - b.volume;
                    }

                    return a.stackCount - b.stackCount;
                }),
                (fit) => hasExcessiveVoidSpace(fit)
            ),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemLength, itemWidth, itemHeight, itemPadding, boxes]);

    const printInstructions = useInstructionsPrinting(
        selectedFitResults[resultIndex]
    );

    const lInputRef = useRef<HTMLInputElement>(null);
    const wInputRef = useRef<HTMLInputElement>(null);
    const hInputRef = useRef<HTMLInputElement>(null);
    const pInputRef = useRef<HTMLInputElement>(null);

    return (
        <VStack spacing={4} w="full">
            <Flex
                p={4}
                borderRadius="md"
                backgroundColor="white"
                wrap="wrap"
                alignItems="center"
                w="full"
            >
                <VStack w="full">
                    <HStack align="stretch">
                        <VStack align="start">
                            <Text
                                fontWeight="bold"
                                fontSize="xs"
                                textTransform="uppercase"
                                pl="10px"
                            >
                                Length
                            </Text>
                            <NumberInput defaultValue={1}>
                                <NumberInputField
                                    p={4}
                                    placeholder="Length"
                                    onChange={(e) =>
                                        setItemLength(
                                            Number(e.target.value) || 1
                                        )
                                    }
                                    ref={lInputRef}
                                    onClick={() => {
                                        if (
                                            (lInputRef.current?.value.length ??
                                                0) > 0
                                        )
                                            lInputRef.current?.select();
                                    }}
                                />
                            </NumberInput>
                        </VStack>
                        <VStack>
                            <Spacer />
                            <Text pb={2}>x</Text>
                        </VStack>
                        <VStack align="start">
                            <FormControl isInvalid={itemWidth > itemLength}>
                                <FormLabel
                                    fontWeight="bold"
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    pl="10px"
                                    htmlFor="width"
                                >
                                    Width
                                </FormLabel>
                                <NumberInput defaultValue={1} id="width">
                                    <NumberInputField
                                        p={4}
                                        placeholder="Width"
                                        color={
                                            itemWidth > itemLength
                                                ? "red.500"
                                                : undefined
                                        }
                                        onChange={(e) =>
                                            setItemWidth(
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
                            <Text
                                fontWeight="bold"
                                fontSize="xs"
                                textTransform="uppercase"
                                pl="10px"
                            >
                                Height
                            </Text>
                            <NumberInput defaultValue={1}>
                                <NumberInputField
                                    p={4}
                                    placeholder="Height"
                                    onChange={(e) =>
                                        setItemHeight(
                                            Number(e.target.value) || 1
                                        )
                                    }
                                    ref={hInputRef}
                                    onClick={() => {
                                        if (
                                            (hInputRef.current?.value.length ??
                                                0) > 0
                                        )
                                            hInputRef.current?.select();
                                    }}
                                />
                            </NumberInput>
                        </VStack>

                        <VStack align="start" pl={4}>
                            <Text
                                fontWeight="bold"
                                fontSize="xs"
                                textTransform="uppercase"
                                pl="10px"
                            >
                                Padding
                            </Text>
                            <NumberInput defaultValue={0}>
                                <NumberInputField
                                    p={4}
                                    placeholder="Padding"
                                    onChange={(e) =>
                                        setItemPadding(Number(e.target.value))
                                    }
                                    ref={pInputRef}
                                    onClick={() => {
                                        if (
                                            (pInputRef.current?.value.length ??
                                                0) > 0
                                        )
                                            pInputRef.current?.select();
                                    }}
                                />
                            </NumberInput>
                        </VStack>
                    </HStack>
                </VStack>
            </Flex>
            <Box display={["block", "flex"]} w="full">
                <Box
                    backgroundColor="gray.900"
                    borderRadius="md"
                    h="15rem"
                    w={["full", "15rem"]}
                >
                    <VisualAid
                        item={{
                            length:
                                selectedFitResults[resultIndex]?.item.length ??
                                1,
                            width:
                                selectedFitResults[resultIndex]?.item.width ??
                                1,
                            height:
                                selectedFitResults[resultIndex]?.item.height ??
                                1,
                        }}
                        container={{
                            length:
                                selectedFitResults[resultIndex]
                                    ?.alteredDimensions.length ?? 0,
                            width:
                                selectedFitResults[resultIndex]
                                    ?.alteredDimensions.width ?? 0,
                            height:
                                selectedFitResults[resultIndex]
                                    ?.alteredDimensions.height ?? 0,
                        }}
                        padding={itemPadding}
                    />
                </Box>
                <Box
                    ml={[0, 4]}
                    mt={[4, 0]}
                    p={4}
                    borderRadius="md"
                    backgroundColor="white"
                    flexGrow={1}
                    w="full"
                >
                    {fitResults && (
                        <>
                            <HStack mb={4}>
                                <Select
                                    value={resultMethod}
                                    onChange={(e) =>
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        setResultMethod(e.target.value as any)
                                    }
                                >
                                    {fitResults.AS_IS.length > 0 && (
                                        <option value="AS_IS">
                                            Without modifications
                                        </option>
                                    )}
                                    {fitResults.STACKED.length > 0 && (
                                        <option value="STACKED">
                                            With stacking
                                        </option>
                                    )}
                                    {fitResults.MODIFIED.length > 0 && (
                                        <option value="MODIFIED">
                                            With adjustment
                                        </option>
                                    )}
                                    {fitResults.MODIFIED_AND_STACKED.length >
                                        0 && (
                                        <option value="MODIFIED_AND_STACKED">
                                            With both adjustment and stacking
                                        </option>
                                    )}
                                </Select>
                                <IconButton
                                    w="6rem"
                                    aria-label="Previous"
                                    icon={<ChevronLeftIcon />}
                                    isDisabled={resultIndex - 1 < 0}
                                    onClick={() =>
                                        setResultIndex(resultIndex - 1)
                                    }
                                />
                                <IconButton
                                    w="6rem"
                                    aria-label="Next"
                                    icon={<ChevronRightIcon />}
                                    isDisabled={
                                        selectedFitResults[resultIndex + 1] ===
                                        undefined
                                    }
                                    onClick={() =>
                                        setResultIndex(resultIndex + 1)
                                    }
                                />
                                <IconButton
                                    minW="2rem"
                                    colorScheme="blue"
                                    aria-label="Print instructions"
                                    icon={<Icon as={MdPrint} />}
                                    isDisabled={
                                        selectedFitResults[resultIndex] ===
                                        undefined
                                    }
                                    onClick={() => printInstructions()}
                                />
                            </HStack>
                            {selectedFitResults[resultIndex] !== undefined && (
                                <Instructions
                                    fitResult={selectedFitResults[resultIndex]}
                                />
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </VStack>
    );
};

export default Home;
