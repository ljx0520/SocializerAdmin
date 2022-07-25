import type {AppProps} from "next/app";
import Head from "next/head";
import {Provider} from "react-redux";
import Layout from "layouts";
import Router from "next/router";
import NProgress from "nprogress";
import "css/tailwind.css";
import "css/main.css";
import "css/layouts/layout-1.css";
import "css/animate.css";
import "css/components/left-sidebar-1/styles-lg.css";
import "css/components/left-sidebar-1/styles-sm.css";
import "css/components/nprogress.css";

import rootStore from "../redux/store";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function App({Component, pageProps}: AppProps): React.ReactElement {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>Socializer Admin</title>
            </Head>
            <Provider store={rootStore.store}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        </>
    );
}

export default App;
