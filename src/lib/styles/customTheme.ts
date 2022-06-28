import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                backgroundColor: "gray.800",
            },
        },
    },
    fonts: {
        heading: "Roboto, sans-serif",
        body: "Roboto, sans-serif",
    },
    config: {
        initialColorMode: "light",
    },
});
