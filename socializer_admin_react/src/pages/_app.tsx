import Head from "next/head";
import {Provider} from "react-redux";
import Layout from "layouts";
import Router from "next/router";
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
import React, {useEffect, useState} from "react";
import getConfig from 'next/config';
import LoadingContainer from "../components/loading-container";

const {publicRuntimeConfig} = getConfig();

NProgress.configure({showSpinner: false});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface IProps {
    Component: NextPage;
    pageProps: any;
}

function App({Component, pageProps}: IProps) {
    const {promiseInProgress} = usePromiseTracker({delay: 500});

    const [loading, setLoading] = useState(() => false)

    useEffect(() => {
        if (promiseInProgress) {
            setLoading(true);
            NProgress.start();
        } else {
            NProgress.done()
            if (loading) {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        }
    }, [promiseInProgress])

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <link rel="icon" href={`${publicRuntimeConfig.backendUrl}/favicon.ico`}/>
                <title>Socializer Admin</title>
            </Head>
            <Provider store={rootStore.store}>
                <RouteGuard>
                    {
                        loading ? <LoadingContainer loading={loading}/> : <></>
                    }
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
