/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable sonarjs/no-identical-functions */
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    NumberInput,
    NumberInputField,
    Spacer,
    Switch,
    Text,
    useBoolean,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { GlobalContext } from "lib/context/global";
import { fits } from "lib/helpers/boxFitting";
import type { BoxData } from "lib/structs/BoxData";
import { boxDefaults } from "lib/util/boxDefaults";
import { dimensionsAreSame } from "lib/util/dimensions";
import { selectInput } from "lib/util/selectInput";

import Instructions from "./components/Instructions";
import VisualAid from "./components/VisualAid";

const Home = () => {
    const toast = useToast();

    const { boxes } = useContext(GlobalContext);
    const [itemLength, setItemLength] = useState(1);
    const [itemWidth, setItemWidth] = useState(1);
    const [itemHeight, setItemHeight] = useState(1);
    const [itemPadding, setItemPadding] = useState(0);
    const [itemWeight, setItemWeight] = useState(0);
    const [
        shouldShowBasicResults,
        { on: showBasicResults, off: dontShowBasicResults },
    ] = useBoolean(true);
    const [
        shouldShowStackResults,
        { on: showStackResults, off: dontShowStackResults },
    ] = useBoolean(true);
    const [
        shouldShowAdjustResults,
        { on: showAdjustResults, off: dontShowAdjustResults },
    ] = useBoolean(true);
    const [
        shouldShowComplexResults,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        { on: showComplesResults, off: dontShowComplexResults },
    ] = useBoolean(true);
    const fitResults = useMemo(() => {
        let boxList: BoxData[];

        if (!boxes || boxes.length < 1) {
            if (
                !localStorage.getItem("db_version") ||
                localStorage.getItem("db_version") !== "2"
            ) {
                boxList = boxDefaults;

                toast({
                    status: "info",
                    title: "First load detected.",
                    description:
                        "Reload the page to finish setting up this application. If this message is unexpected, please file a bug report.",
                });
            } else {
                return undefined;
            }
        } else boxList = boxes;

        if (itemWidth > itemLength) {
            return undefined;
        }

        return fits(
            {
                length: itemLength,
                width: itemWidth,
                height: itemHeight,
            },
            boxList,
            itemPadding,
            itemWeight
        ).filter((fit) => {
            if (
                !shouldShowBasicResults &&
                dimensionsAreSame(
                    fit.unalteredContainerDimensions,
                    fit.alteredContainerDimensions
                )
            ) {
                return false;
            }

            if (!shouldShowStackResults && fit.tags.MODIFICATIONS_STACKED) {
                return false;
            }

            if (!shouldShowAdjustResults && fit.tags.MODIFICATIONS_ADJUSTED) {
                return false;
            }

            return !(
                !shouldShowComplexResults &&
                fit.tags.MODIFICATIONS_STACKED &&
                fit.tags.MODIFICATIONS_ADJUSTED
            );
        });
    }, [
        itemLength,
        itemWidth,
        itemHeight,
        itemPadding,
        itemWeight,
        boxes,
        shouldShowBasicResults,
        shouldShowStackResults,
        shouldShowAdjustResults,
        shouldShowComplexResults,
        toast,
    ]);
    const [resultIndex, setResultIndex] = useState(0);

    useEffect(() => {
        setResultIndex(0);
    }, [fitResults]);

    const lInputRef = useRef<HTMLInputElement>(null);
    const wInputRef = useRef<HTMLInputElement>(null);
    const hInputRef = useRef<HTMLInputElement>(null);
    const pInputRef = useRef<HTMLInputElement>(null);
    const weightInputRef = useRef<HTMLInputElement>(null);

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
                <VStack w="full" spacing={4}>
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
                                    onClick={() => selectInput(lInputRef)}
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
                                        onClick={() => selectInput(wInputRef)}
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
                                    onClick={() => selectInput(hInputRef)}
                                />
                            </NumberInput>
                        </VStack>
                    </HStack>
                    <HStack align="stretch">
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
                                    onClick={() => selectInput(pInputRef)}
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
                                Weight
                            </Text>
                            <NumberInput defaultValue={0}>
                                <NumberInputField
                                    p={4}
                                    placeholder="Weight"
                                    onChange={(e) =>
                                        setItemWeight(Number(e.target.value))
                                    }
                                    ref={weightInputRef}
                                    onClick={() => selectInput(weightInputRef)}
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
                                fitResults?.[resultIndex]?.item.dimensions
                                    .length ?? 1,
                            width:
                                fitResults?.[resultIndex]?.item.dimensions
                                    .width ?? 1,
                            height:
                                fitResults?.[resultIndex]?.item.dimensions
                                    .height ?? 1,
                        }}
                        container={{
                            length:
                                fitResults?.[resultIndex]
                                    ?.alteredContainerDimensions.length ?? 0,
                            width:
                                fitResults?.[resultIndex]
                                    ?.alteredContainerDimensions.width ?? 0,
                            height:
                                fitResults?.[resultIndex]
                                    ?.alteredContainerDimensions.height ?? 0,
                        }}
                        padding={fitResults?.[resultIndex]?.item.padding ?? 0}
                        cutDownAmount={
                            fitResults?.[resultIndex]?.containerCutDownAmount ??
                            0
                        }
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
                            <HStack
                                mb={4}
                                flexWrap="wrap"
                                justifyContent="space-between"
                            >
                                <FormControl
                                    maxW="6rem"
                                    display="flex"
                                    alignItems="center"
                                    flexDirection="column"
                                    p={2}
                                >
                                    <FormLabel
                                        htmlFor="showunmodified"
                                        m={0}
                                        fontSize="sm"
                                    >
                                        Unmodified
                                    </FormLabel>
                                    <Switch
                                        id="showunmodified"
                                        isChecked={shouldShowBasicResults}
                                        onChange={(e) =>
                                            e.target.checked
                                                ? showBasicResults()
                                                : dontShowBasicResults()
                                        }
                                    />
                                </FormControl>
                                <FormControl
                                    maxW="6rem"
                                    display="flex"
                                    alignItems="center"
                                    flexDirection="column"
                                    p={2}
                                >
                                    <FormLabel
                                        htmlFor="showstacked"
                                        m={0}
                                        fontSize="sm"
                                    >
                                        Stacked
                                    </FormLabel>
                                    <Switch
                                        id="showstacked"
                                        isChecked={shouldShowStackResults}
                                        onChange={(e) =>
                                            e.target.checked
                                                ? showStackResults()
                                                : dontShowStackResults()
                                        }
                                    />
                                </FormControl>
                                <FormControl
                                    maxW="6rem"
                                    display="flex"
                                    alignItems="center"
                                    flexDirection="column"
                                    p={2}
                                >
                                    <FormLabel
                                        htmlFor="showadjusted"
                                        m={0}
                                        fontSize="sm"
                                    >
                                        Adjusted
                                    </FormLabel>
                                    <Switch
                                        id="showadjusted"
                                        isChecked={shouldShowAdjustResults}
                                        onChange={(e) =>
                                            e.target.checked
                                                ? showAdjustResults()
                                                : dontShowAdjustResults()
                                        }
                                    />
                                </FormControl>
                                <HStack>
                                    <IconButton
                                        minW="6rem"
                                        aria-label="Previous"
                                        icon={<ChevronLeftIcon />}
                                        isDisabled={resultIndex - 1 < 0}
                                        onClick={() =>
                                            setResultIndex(resultIndex - 1)
                                        }
                                    />
                                    <IconButton
                                        minW="6rem"
                                        aria-label="Next"
                                        icon={<ChevronRightIcon />}
                                        isDisabled={
                                            fitResults[resultIndex + 1] ===
                                            undefined
                                        }
                                        onClick={() =>
                                            setResultIndex(resultIndex + 1)
                                        }
                                    />
                                </HStack>
                            </HStack>
                            {fitResults[resultIndex] !== undefined && (
                                <Instructions
                                    fitResult={fitResults[resultIndex]}
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
