import {useRouter} from "next/router";
import {trackPromise} from "react-promise-tracker";
import request from "../../service/fetch";
import {IPage} from "../../lib";
import {notify} from "../../utils/notify";
import {useEffect, useState} from "react";
import SectionTitle from "../../components/section-title";
import {Dispute} from "../disputes";

export default function Index() {
    const router = useRouter();
    const {id} = router.query;
    const [data, setData] = useState<Dispute | null>(() => null)

    const getDispute = () => {
        trackPromise(
            request
                .get(`/api/disputes/${id}`)
                .then((res: any) => {
                    if (res.data.code === 200) {
                        var data = res.data.data;
                        // console.log(data)
                        setData(data)
                    } else {
                        notify(res.data.msg, "warn")
                    }
                }));
    }

    useEffect(() => {
        return () => {
            getDispute();
        }
    }, [])

    return (
        data != null ? <>
            <SectionTitle title="Reports & Requests" subtitle={data.id}/>
        </> : <>Not Found</>
    )

}
