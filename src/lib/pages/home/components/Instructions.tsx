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
import { AiOutlineRotateRight } from "react-icons/ai";
import { BiDumbbell } from "react-icons/bi";
import { BsViewStacked } from "react-icons/bs";
import { MdOutlineContentCut, MdCompareArrows } from "react-icons/md";

import type { FitData } from "lib/helpers/Fit";

export default function Instructions({ fitResult }: { fitResult: FitData }) {
    const {
        isItemRotated,
        unalteredContainerDimensions,
        alteredContainerDimensions,
        containerCutDownAmount,
        containerStackCount,
        containerAdjustAmount,
        tags,
    } = fitResult;

    return (
        <Box
            p={4}
            borderWidth="thin"
            borderRadius="md"
            borderStyle="dashed"
            fontFamily="mono"
        >
            <HStack fontWeight="bold" mb={1} flexWrap="wrap">
                <Text>
                    {unalteredContainerDimensions.length}x
                    {unalteredContainerDimensions.width}x
                    {unalteredContainerDimensions.height}
                </Text>
                <ArrowForwardIcon />
                <Text>
                    {alteredContainerDimensions.length}x
                    {alteredContainerDimensions.width}x
                    {alteredContainerDimensions.height}
                </Text>
            </HStack>
            <HStack mb={2} flexWrap="wrap">
                {tags.MODIFICATIONS_STACKED && (
                    <Badge colorScheme="blue">Stacked</Badge>
                )}
                {tags.MODIFICATIONS_ADJUSTED && (
                    <Badge colorScheme="blue">Adjusted</Badge>
                )}
                {tags.WEIGHT_ACCEPTABLE && (
                    <Badge colorScheme="orange">Item weight high</Badge>
                )}
                {tags.WEIGHT_EXCESSIVE && (
                    <Badge colorScheme="red">Item weight high</Badge>
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
                {tags.MODIFICATIONS_STACKED && (
                    <ListItem>
                        <ListIcon h={5} color="gray.600" as={BsViewStacked} />
                        Stacked {containerStackCount}x
                    </ListItem>
                )}
                {tags.MODIFICATIONS_ADJUSTED && (
                    <ListItem>
                        <ListIcon h={5} color="gray.600" as={MdCompareArrows} />
                        Adjusted ({containerAdjustAmount})
                    </ListItem>
                )}
                {containerCutDownAmount > 0 && (
                    <ListItem>
                        <ListIcon
                            h={5}
                            color="gray.600"
                            as={MdOutlineContentCut}
                        />
                        Can be cut down to {alteredContainerDimensions.length}x
                        {alteredContainerDimensions.width}x
                        {alteredContainerDimensions.height -
                            containerCutDownAmount}{" "}
                        (-
                        {containerCutDownAmount})
                    </ListItem>
                )}
                {tags.WEIGHT_EXCESSIVE && (
                    <ListItem>
                        <ListIcon h={5} color="gray.600" as={BiDumbbell} />
                        May need to be reinforced
                    </ListItem>
                )}
            </List>
        </Box>
    );
}
