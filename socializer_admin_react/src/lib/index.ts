import jwt_decode from 'jwt-decode';

export const BASE_URL = "http://0.0.0.0:8000";

export const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000

export const ironOptions = {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: process.env.SESSION_COOKIE_NAME as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        maxAge: COOKIE_MAX_AGE, // 1 day
        secure: process.env.NODE_ENV === "production",
    },
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
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
