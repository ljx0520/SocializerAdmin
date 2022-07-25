import {TypedUseSelectorHook, useSelector, useDispatch} from "react-redux";
import {AppDispatch, AppState} from "./store";

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

