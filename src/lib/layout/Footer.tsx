import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Flex
            as="footer"
            width="full"
            align="center"
            alignSelf="flex-end"
            justifyContent="center"
        >
            <Text fontSize="xs" color="white">
                {new Date().getFullYear()} -{" "}
                <Link href="https://jdeurt.xyz" isExternal>
                    sycon.app
                </Link>
            </Text>
        </Flex>
    );
};

export default Footer;
