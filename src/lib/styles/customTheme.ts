import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Roboto, sans-serif",
    body: "Roboto, sans-serif",
  },
  components: {
    // Button: {
    // }
  },
  config: {
    initialColorMode: "light",
  },
});
