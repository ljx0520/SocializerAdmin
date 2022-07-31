import Head from "next/head";
import Navbar1 from "components/navbar-1";
import LeftSidebar1 from "components/left-sidebar-1";
import {useAppSelector} from "redux/hooks";
import React from "react";

export type Layout1Props = {
    children: React.ReactNode;
};

const Layout1: React.FC<Layout1Props> = ({children}) => {
    const config = useAppSelector((state) => state.config);
    const {background, layout, collapsed} = config;
    return (
        <>
            <Head>
                <title>Socializer Admin</title>
            </Head>
            <div
                data-layout={layout}
                data-collapsed={collapsed}
                data-background={background}
                className={`font-sans antialiased text-sm disable-scrollbars ${
                    background === "dark" ? "dark" : ""
                }`}>
                <div className="wrapper">
                    <LeftSidebar1/>
                    <div className="main w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
                        <Navbar1/>
                        <div className="w-full min-h-screen p-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Layout1;
