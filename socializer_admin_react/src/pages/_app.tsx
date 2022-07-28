import type {AppProps} from "next/app";
import Head from "next/head";
import {Provider} from "react-redux";
import Layout from "layouts";
import Router, {useRouter} from "next/router";
import NProgress from "nprogress";
import 'react-toastify/dist/ReactToastify.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import "css/tailwind.css";
import "css/main.css";
import "css/layouts/layout-1.css";
import "css/animate.css";
import "css/components/left-sidebar-1/styles-lg.css";
import "css/components/left-sidebar-1/styles-sm.css";
import "css/components/nprogress.css";

import rootStore from "redux/store";
import {ToastContainer, Slide} from 'react-toastify';
import {NextPage} from "next";
import RouteGuard from "components/route-guard";
import {usePromiseTracker} from "react-promise-tracker";
import {useEffect} from "react";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface IProps {
    Component: NextPage;
    pageProps: any;
}

function App({Component, pageProps}: IProps) {
    const {promiseInProgress} = usePromiseTracker({delay: 500});

    useEffect(() => {
        if (promiseInProgress) {
            NProgress.start()
        } else {
            NProgress.done()
        }
    }, [promiseInProgress])

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
                <RouteGuard>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        draggable={false}
                        transition={Slide}
                        pauseOnHover/>
                </RouteGuard>
            </Provider>
        </>
    );
}

export default App;
