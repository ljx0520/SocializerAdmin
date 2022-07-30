import {NextApiRequest, NextApiResponse} from 'next';
import {withIronSessionApiRoute} from "iron-session/next";
import {ISession} from "pages/api";
import request from 'service/fetch';
import {ironOptions, BASE_URL} from "lib";

export default withIronSessionApiRoute(getDetail, ironOptions);

// get disputes list
async function getDetail(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const {id} = req.query

    const url = `${BASE_URL}/v1/disputes/${id}/`;

    if (req.method === 'GET') {
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
            res.status(200).json({
                code: error.response?.status || 500,
                msg: error.response?.data?.detail || "Unexpected Error"
            });
        });
    } else if (req.method === 'PUT') {
        const {dispute_status = '', dispute_result = '', dispute_notes = '', note = ''} = req.body;
        console.log(JSON.stringify(req.body, null, 2));
        await request.put(
            url, {
                dispute_status: dispute_status,
                dispute_result: dispute_result,
                dispute_notes: dispute_notes,
                note: note,
            },
            {
                headers: {
                    'Authorization': `Bearer ${session.token}`
                }
            }
        ).then(async (response) => {

            const {data} = response as any;

            console.log(data)

            res.status(200).json({
                code: 200,
                msg: "Update Success",
                data: data
            });
        }).catch((error: any) => {
            res.status(200).json({
                code: error.response?.status || 500,
                msg: error.response?.data?.detail || "Unexpected Error"
            });
        });
    }


}
