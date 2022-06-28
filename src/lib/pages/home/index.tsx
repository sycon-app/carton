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
    VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { MdPrint } from "react-icons/md";

import type { FitResult } from "lib/structs/FitResult";
import { boxDefaults } from "lib/util/boxDefaults";
import { findFits } from "lib/util/findPotentialBoxes";
import useInstructionsPrinting from "lib/util/hooks/useInstructionsPrinting";

import Instructions from "./components/Instructions";
import VisualAid from "./components/VisualAid";

const Home = () => {
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
        if (resultMethod === "AS_IS") setResultIndex(0);

        setResultMethod("AS_IS");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemLength, itemWidth, itemHeight]);

    useEffect(() => {
        setResultIndex(0);
    }, [resultMethod]);

    useEffect(() => {
        if (itemWidth > itemLength) {
            setFitResults(undefined);

            return;
        }

        const easyFits = findFits(
            ["AS_IS"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );
        const easyFitsWithRotation = findFits(
            ["AS_IS", "ROTATE"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );
        const stackFits = findFits(
            ["STACK"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );
        const stackFitsWithRotation = findFits(
            ["STACK", "ROTATE"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );
        const modifyFits = findFits(
            ["MODIFY"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );
        const modifyFitsWithRotation = findFits(
            ["MODIFY", "ROTATE"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );
        const complexFits = findFits(
            ["MODIFY_AND_STACK"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );
        const complexFitsWithRotation = findFits(
            ["MODIFY_AND_STACK", "ROTATE"],
            { length: itemLength, width: itemWidth, height: itemHeight },
            boxDefaults,
            itemPadding
        );

        setFitResults({
            AS_IS: [...easyFits, ...easyFitsWithRotation].sort(
                (a, b) => a.volume - b.volume
            ),
            STACKED: [...stackFits, ...stackFitsWithRotation].sort(
                (a, b) => a.volume - b.volume
            ),
            MODIFIED: [...modifyFits, ...modifyFitsWithRotation].sort(
                (a, b) => a.volume - b.volume
            ),
            MODIFIED_AND_STACKED: [
                ...complexFits,
                ...complexFitsWithRotation,
            ].sort((a, b) => a.volume - b.volume),
        });
    }, [itemLength, itemWidth, itemHeight, itemPadding]);

    const printInstructions = useInstructionsPrinting(
        selectedFitResults[resultIndex]
    );

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
                                    placeholder="Length"
                                    onChange={(e) =>
                                        setItemLength(
                                            Number(e.target.value) || 1
                                        )
                                    }
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
                                    placeholder="Height"
                                    onChange={(e) =>
                                        setItemHeight(
                                            Number(e.target.value) || 1
                                        )
                                    }
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
                                    placeholder="Padding"
                                    onChange={(e) =>
                                        setItemPadding(Number(e.target.value))
                                    }
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
                                    aria-label="Previous"
                                    icon={<ChevronLeftIcon />}
                                    isDisabled={resultIndex - 1 < 0}
                                    onClick={() =>
                                        setResultIndex(resultIndex - 1)
                                    }
                                />
                                <IconButton
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
