import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {actionLog} from "./middleware/actionLog";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";

const peristConfig = {
    key: "root",
    storage,
    whitelist: ["user"]  // 对应 user: userSlice.reducer
}

const rootReducer = combineReducers(
    {
    }
)

const persistedReducer = persistReducer(peristConfig, rootReducer)

// const store = createStore(rootReduce, applyMiddleware(thunk, actionLog));

const store = configureStore(
    {
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware => [...getDefaultMiddleware(), actionLog]),
        devTools: true,

    }
);

const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default {store, persistor};