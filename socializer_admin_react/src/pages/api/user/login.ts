import {NextApiRequest, NextApiResponse} from 'next';
import {withIronSessionApiRoute} from "iron-session/next";
import {ISession} from "pages/api";
import request from 'service/fetch';
import {ironOptions, BASE_URL} from "lib";

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const {username = '', password = ''} = req.body;

    const url = `${BASE_URL}/token/`;

    await request.post(
        url,
        {
            username: username,
            password: password
        },
    ).then(async (response) => {

        const {data} = response as any;

        // save session
        session.token = data.access;
        await session.save();

        res.status(200).json({
            code: 200,
            msg: "Login Success"
        });
    }).catch((error: any) => {
        res.status(200).json({
            code: error.response?.status || 500,
            msg: error.response?.data?.detail || "Unexpected Error"
        });
    });

}
