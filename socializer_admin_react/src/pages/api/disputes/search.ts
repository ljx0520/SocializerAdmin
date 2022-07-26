import {NextApiRequest, NextApiResponse} from 'next';
import {withIronSessionApiRoute} from "iron-session/next";
import {ISession} from "pages/api";
import {Cookie} from "next-cookie";
import request from 'service/fetch';
import {consoleLog} from "utils";
import {ironOptions, BASE_URL} from "lib";

export default withIronSessionApiRoute(search, ironOptions);

// get disputes list
async function search(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res);
    const {dispute_status = '', page = '1'} = req.body;

    const url = `${BASE_URL}/v1/disputes/`;

    await request.get(
        url, {
            params: {
                dispute_status: dispute_status,
                page: page
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
