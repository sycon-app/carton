import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
    Badge,
    Box,
    HStack,
    List,
    ListIcon,
    ListItem,
    Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { AiOutlineRotateRight } from "react-icons/ai";
import { BsViewStacked } from "react-icons/bs";
import { MdOutlineContentCut, MdCompareArrows } from "react-icons/md";

import type { FitResult } from "lib/structs/FitResult";

export default function Instructions({ fitResult }: { fitResult: FitResult }) {
    const {
        itemWithPadding,
        unalteredDimensions,
        alteredDimensions,
        isItemRotated,
        stackCount,
    } = fitResult;

    const isAdjusted = useMemo(() => {
        return (
            unalteredDimensions.length !== alteredDimensions.length ||
            unalteredDimensions.width !== alteredDimensions.width
        );
    }, [unalteredDimensions, alteredDimensions]);

    return (
        <Box
            p={4}
            borderWidth="thin"
            borderRadius="md"
            borderStyle="dashed"
            fontFamily="mono"
        >
            <HStack fontWeight="bold" mb={2}>
                <Text>
                    {unalteredDimensions.length}x{unalteredDimensions.width}x
                    {unalteredDimensions.height}
                </Text>
                <ArrowForwardIcon />
                <Text>
                    {alteredDimensions.length}x{alteredDimensions.width}x
                    {alteredDimensions.height}
                </Text>
                {alteredDimensions.length * alteredDimensions.width -
                    itemWithPadding.length * itemWithPadding.width >
                    itemWithPadding.length * itemWithPadding.width && (
                    <Badge colorScheme="orange">Large void space</Badge>
                )}
            </HStack>
            <List>
                {isItemRotated && (
                    <ListItem>
                        <ListIcon
                            h={5}
                            color="gray.600"
                            as={AiOutlineRotateRight}
                        />
                        Item laid on its side
                    </ListItem>
                )}
                {stackCount > 1 && (
                    <ListItem>
                        <ListIcon h={5} color="gray.600" as={BsViewStacked} />
                        Stacked {stackCount}x
                    </ListItem>
                )}
                {isAdjusted && (
                    <ListItem>
                        <ListIcon h={5} color="gray.600" as={MdCompareArrows} />
                        Adjusted (
                        {alteredDimensions.length - unalteredDimensions.length})
                    </ListItem>
                )}
                {alteredDimensions.height - itemWithPadding.height !== 0 && (
                    <ListItem>
                        <ListIcon
                            h={5}
                            color="gray.600"
                            as={MdOutlineContentCut}
                        />
                        Can be cut down to {alteredDimensions.length}x
                        {alteredDimensions.width}x{itemWithPadding.height} (-
                        {alteredDimensions.height - itemWithPadding.height})
                    </ListItem>
                )}
            </List>
        </Box>
    );
}
