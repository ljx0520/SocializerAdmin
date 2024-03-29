import Link from "next/link";
import Image from "next/image";
import React from "react";
import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

const ErrorPage: React.FC = () => {
    return (
        <div className="flex flex-col w-full max-w-xl text-center">
            <Image
                className="object-contain w-auto h-64 mb-8"
                src={`${publicRuntimeConfig.backendUrl}/images/illustration.svg`}
                width={400}
                height={400}
                alt="svg"
            />
            <h1 className="text-6xl text-blue-500 mb-4">404</h1>

            <div className="mb-8 text-center text-gray-900 dark:text-white">
                {"We're sorry. The page you requested could not be found. Please go back to the homepage or contact us"}
            </div>
            <div className="flex w-full">
                <Link href="/">
                    <a className="w-full px-6 py-3 text-base font-bold text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                        Go back
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
