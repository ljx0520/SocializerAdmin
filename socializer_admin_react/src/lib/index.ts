import jwt_decode from 'jwt-decode';

const {format} = require('date-fns');

import axios from 'axios';
import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

export const BASE_URL = "https://api.muslimlife.com.au/socializer/admin";

export const IMAGE_ROOT = "https://d1aq6owl2qol3t.cloudfront.net/public";

export const COOKIE_MAX_AGE = 24 * 60 * 60 // one day

export const ironOptions = {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: process.env.SESSION_COOKIE_NAME as string,

    ttl: COOKIE_MAX_AGE, // - 60 s
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        domain: process.env.NODE_ENV === "production" ? ".muslimlife.com.au" : undefined,
        // maxAge: COOKIE_MAX_AGE, // 1 day
        secure: process.env.NODE_ENV === "production"
    },
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
    /*eslint-disable */
    interface IronSessionData {
        token?: string;
    }
}

export type IJWT = {
    token_type: string,
    exp: number,
    iat: number,
    jti: string,
    user_id: number
}


export function decodeJWT(token: string): [IJWT | null, boolean] {


    var isExpired = true;
    try {
        const decoded = jwt_decode<IJWT>(token);
        if (decoded) {
            if (decoded.exp * 1000 > Date.now()) {
                isExpired = false;
            }
        }
        return [decoded, isExpired]
    } catch (e) {
        // cannot decode
    }

    return [null, true]

}

export type IPage = {
    count: number,
    page_size: number,
    page_number: number,
    from: number,
    to: number,
    next: string | null,
    previous: string | null
}

export const defaultPage: IPage = {
    count: 0,
    page_size: 10,
    page_number: 1,
    from: 0,
    to: 0,
    next: null,
    previous: null
}

export function formatDate(date: string): string {
    if (date === '0001-01-01 00:00:00 UTC') {
        return "NA"
    }
    try {
        var parsedDate = new Date(date);
        return format(parsedDate, 'EEEE, MMMM do, yyyy, hh:mm a')
    } catch (e) {
        return `Date Format Error ${date}`
    }

}


export function getAge(date: string): string {
    var parsedDate = new Date(date);
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var age = currentYear - parsedDate.getFullYear();
    return age.toString();
}


export function formatCurrency(money: string): string {
    try {
        var parsedMoney = parseFloat(money);
        return `$${parsedMoney.toFixed(2)}`
    } catch (e) {
        return `Currency Format Error ${money}`
    }

}

export function formatNumber(num: string): string {
    try {
        var parsedNum = parseFloat(num);
        return `${parsedNum.toFixed(2)}`
    } catch (e) {
        return `Number Format Error ${num}`
    }

}


export const consoleLog = (message?: any, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV !== "production") {
        console.log(message, ...optionalParams);
    }
}

const requestInstance = axios.create({
    baseURL: publicRuntimeConfig.backendUrl,
    timeout: 10000
});

requestInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default requestInstance;