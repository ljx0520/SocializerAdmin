import {withIronSessionApiRoute} from "iron-session/next";
import {decodeJWT, ironOptions} from "lib";
import {NextApiRequest, NextApiResponse} from "next";

export type User = {
    isLoggedIn: boolean;
    // token: string;
};

export default withIronSessionApiRoute(userRoute, ironOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    if (req.session.token) {

        // verify token
        const [decodedJWT, isExpired] = decodeJWT(req.session.token);

        if (decodedJWT) {
            if (isExpired) {
                res.json({
                    isLoggedIn: false,
                    // token: req.session.token,
                });
            } else {
                res.json({
                    isLoggedIn: true,
                    // token: req.session.token,
                });
            }
        } else {
            res.json({
                isLoggedIn: false,
                // token: req.session.token,
            });
        }
    } else {
        res.json({
            isLoggedIn: false,
            // token: "",
        });
        return
    }
}