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
