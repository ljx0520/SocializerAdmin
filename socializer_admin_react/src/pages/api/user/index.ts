import {withIronSessionApiRoute} from "iron-session/next";
import {ironOptions} from "lib";
import {NextApiRequest, NextApiResponse} from "next";

export type User = {
    isLoggedIn: boolean;
    // token: string;
};

export default withIronSessionApiRoute(userRoute, ironOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    if (req.session.token) {
        // in a real world application you might read the user id from the session and then do a database request
        // to get more information on the user if needed
        res.json({
            isLoggedIn: true,
            // token: req.session.token,
        });
    } else {
        res.json({
            isLoggedIn: false,
            // token: "",
        });
    }
}