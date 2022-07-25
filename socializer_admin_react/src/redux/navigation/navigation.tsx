import {createSlice} from "@reduxjs/toolkit";
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

const initialState: NavigationState[] = [
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
                title: "Disputes",
                items: [],
            },
        ],
    },
];

// Define the initial state using that type

export const navigationSlice = createSlice({
    name: "navigation",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
});

export default navigationSlice.reducer;
