import type { PathRouteProps } from "react-router-dom";

import Layout from "../layout";
import Home from "../pages/home";

export const routes: Array<PathRouteProps> = [
    {
        path: "/",
        element: (
            <Layout>
                <Home />
            </Layout>
        ),
    },
];
