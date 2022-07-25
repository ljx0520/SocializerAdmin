import {useRouter} from "next/router";

export default function Index() {
    const router = useRouter();
    const {id} = router.query;

    console.log(router.query)

    return (
        <div className="container">
            <h1> Dispute {id} </h1>
        </div>
    )

}
