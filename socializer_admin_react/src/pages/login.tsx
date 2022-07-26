import Link from "next/link";
import Layout from "layouts/centered";
import CenteredForm from "layouts/centered-form";
import Login from "components/login/login";

const Index: React.FC = () => {
    return (
        <Layout>
            <CenteredForm
                title="Login"
                subtitle="Please enter your username and password to login">
                <Login/>
            </CenteredForm>
        </Layout>
    );
};

export default Index;
