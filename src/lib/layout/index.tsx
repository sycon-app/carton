import { Box, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { GlobalContext } from "lib/context/global";
import usePersistentBoxData from "lib/util/hooks/usePersistentBoxData";

import Footer from "./Footer";
import Header from "./Header";
import Meta from "./Meta";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const persistent = usePersistentBoxData();

    return (
        <Box margin="0 auto" maxWidth={1000} transition="0.5s ease-out">
            <Meta />
            <GlobalContext.Provider value={persistent}>
                <Flex wrap="wrap" margin="8" minHeight="90vh">
                    <Header />
                    <Box width="full" as="main" marginY={22}>
                        {children}
                    </Box>
                    <Footer />
                </Flex>
            </GlobalContext.Provider>
        </Box>
    );
};

export default Layout;
