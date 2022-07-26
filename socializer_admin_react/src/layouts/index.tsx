import {useEffect} from "react";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import Centered from "./centered";
import Layout1 from "layouts/layout-1";

export type LayoutProps = {
    children: React.ReactNode;
};

const Layouts: React.FC<LayoutProps> = ({children}) => {
    const dispatch = useAppDispatch();
    const config = useAppSelector((state) => state.config);
    const {background} = config;

    useEffect(() => {
        const root = window.document.documentElement;
        const backgroundClass = background === "light" ? "dark" : "light";
        root.classList.remove(backgroundClass);
        root.classList.add(background);
    }, [background]);

    const router = useRouter();
    const {pathname} = router;

    switch (pathname) {
        case "/404":
        case "/500":
            return <Centered>{children}</Centered>;
        case "/login":
        case "/logout":
            return <Centered>{children}</Centered>;
        case "/landing":
        case "/sidebars":
            return <>{children}</>;
        default:
            return <Layout1>{children}</Layout1>;
    }
};

export default Layouts;
