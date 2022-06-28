import {
    Badge,
    Box,
    Flex,
    Heading,
    HStack,
    Image,
    Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <Flex
            as="header"
            width="full"
            align="center"
            alignSelf="flex-start"
            justifyContent="center"
            gridGap={2}
        >
            <Link to="/">
                <HStack spacing={2} color="white">
                    <Heading as="h1" size="md">
                        Carton
                    </Heading>
                    <HStack spacing={1.5}>
                        <Text>by</Text>
                        <Image
                            src="https://static.sycon.app/logo/logo-white.svg"
                            width={7}
                            height={7}
                            alt="Sycon"
                        />
                    </HStack>
                </HStack>
            </Link>

            <Box marginLeft="auto">
                <Badge colorScheme="yellow">Beta</Badge>
            </Box>
        </Flex>
    );
};

export default Header;
