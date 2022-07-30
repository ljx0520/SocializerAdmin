import {NextApiRequest, NextApiResponse} from 'next';
import {withIronSessionApiRoute} from "iron-session/next";
import {ISession} from "pages/api";
import {ironOptions} from "lib";

export default withIronSessionApiRoute(logout, ironOptions);

async function logout(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;

    // destory session
    await session.destroy();

    res.status(200).json({
        code: 200,
        msg: "Logout Success"
    });

}
