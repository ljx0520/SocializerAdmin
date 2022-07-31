import React from "react";
import {HashLoader} from "react-spinners";

export type LoadingContainerProps = {
    loading: boolean
};

const LoadingContainer: React.FC<LoadingContainerProps> = ({
                                                               loading
                                                           }) => {
    return (
        <div
            className="absolute items-center justify-center h-screen flex z-10 w-full bg-white opacity-50">
            <div className="flex items-center justify-center h-screen">
                <HashLoader className="px-auto py-auto" color={"#55afb9"} loading={loading} size={100}/>
            </div>
        </div>
    );
};

export default LoadingContainer;
