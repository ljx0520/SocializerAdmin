import Link from "next/link";
import Layout from "layouts/centered";
import CenteredForm from "layouts/centered-form";
import Login from "components/login/login";
import {useEffect} from "react";
import request from "../service/fetch";
import {notify} from "../utils/notify";
import {useRouter} from "next/router";

const Index: React.FC = () => {

    const router = useRouter();

    useEffect(() => {

        request
            .get('/api/user/logout')
            .then((res: any) => {
                if (res.data.code === 200) {
                    router.push('/login');
                    notify(res.data.msg, "success")
                } else {
                    notify(res.data.msg, "warn")
                }
            });

    }, []);


    return (
        <Layout>
            <CenteredForm
                title="Logout"
                subtitle="Please enter your username and password to login">
                <Login/>
            </CenteredForm>
        </Layout>
    );
};

export default Index;
