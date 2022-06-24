import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { colorMode } = useColorMode();
  const { centerNum } = useParams();

  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="center"
      gridGap={2}
    >
      <Link to={`/${centerNum ?? ""}`}>
        <HStack spacing={2}>
          <Heading as="h1" size="md">
            MBS
          </Heading>
          <HStack spacing={1.5}>
            <Text>by</Text>
            <Image
              src={
                colorMode === "light"
                  ? "https://static.sycon.app/logo/logo.svg"
                  : "https://static.sycon.app/logo/logo-white.svg"
              }
              width={7}
              height={7}
              alt="Sycon"
            />
          </HStack>
        </HStack>
      </Link>

      <Box marginLeft="auto">
        <HStack spacing={4}>
          {centerNum && (
            <Box pl={2}>
              <Badge colorScheme="blue" variant="solid" fontSize="sm">
                {centerNum}
              </Badge>
            </Box>
          )}
          <ThemeToggle />
        </HStack>
      </Box>
    </Flex>
  );
};

export default Header;
