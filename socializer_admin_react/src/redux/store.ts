import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {actionLog} from "./middleware/actionLog";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";
import {configSlice} from "./config/config";
import {navigationSlice} from "./navigation/navigation";
import {leftSidebarSlice} from "./left-sidebar/left-sidebar";

const rootReducer = combineReducers(
    {
        config: configSlice.reducer,
        navigation: navigationSlice.reducer,
        leftSidebar: leftSidebarSlice.reducer,
    }
)
const store = configureStore(
    {
        reducer: rootReducer,
        middleware: (getDefaultMiddleware => [...getDefaultMiddleware(), actionLog]),
        devTools: true,
    }
);


export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default {store};