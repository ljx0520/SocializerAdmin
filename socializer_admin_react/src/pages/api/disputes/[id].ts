import {NextApiRequest, NextApiResponse} from 'next';
import {withIronSessionApiRoute} from "iron-session/next";
import {ISession} from "pages/api";
import {Cookie} from "next-cookie";
import request from 'service/fetch';
import {consoleLog} from "utils";
import {ironOptions, BASE_URL} from "lib";

export default withIronSessionApiRoute(getDetail, ironOptions);

// get disputes list
async function getDetail(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res);
    const { id } = req.query

    const url = `${BASE_URL}/v1/disputes/${id}`;

    await request.get(
        url, {
            headers: {
                'Authorization': `Bearer ${session.token}`
            }
        }
    ).then(async (response) => {

        const {data} = response as any;

        res.status(200).json({
            code: 200,
            msg: "Success",
            data: data
        });
    }).catch((error: any) => {
        consoleLog(error)
        res.status(200).json({
            code: error.response?.status || 500,
            msg: error.response?.data?.detail || "Unexpected Error"
        });
    });

}
