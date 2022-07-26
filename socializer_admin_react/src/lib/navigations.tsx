import {RiDashboardFill} from "react-icons/ri";
import {TbReport} from "react-icons/tb";

export type NavigationState = {
    title: string;
    url?: string | undefined;
    items: NavigationState[];
    icon?: React.ReactNode;
    badge?: {
        color: string;
        text: string | number;
    };
};


export const navigations: NavigationState[] = [
    {
        title: "Applications",
        items: [
            {
                url: "/",
                icon: <RiDashboardFill size={20}/>,
                title: "Dashboard",
                items: [],
            },
            {
                url: "/disputes",
                icon: <TbReport size={20}/>,
                title: "Reports & Requests",
                items: [],
            },
        ],
    },
];