import {NextApiRequest, NextApiResponse} from 'next';
import {withIronSessionApiRoute} from "iron-session/next";
import {ISession} from "pages/api";
import {Cookie} from "next-cookie";
import request from 'service/fetch';
import {consoleLog} from "utils";
import {ironOptions, BASE_URL} from "lib";

export default withIronSessionApiRoute(logout, ironOptions);

async function logout(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res);

    // destory session
    await session.destroy();

    res.status(200).json({
        code: 200,
        msg: "Logout Success"
    });

}
