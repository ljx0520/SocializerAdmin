import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import type {NextPage} from 'next';
import request from "service/fetch";


type Props = {
    children: React.ReactNode
}


const RouteGuard: NextPage<Props> = ({children}) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // on initial load - run auth check
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url: string) {
        // redirect to login page if accessing a private page and not logged in
        const publicPaths = [
            '/login',
            '/logout',
            '/api/user/login',
            '/api/user/logout',
            '/404'];
        const path = url.split('?')[0];

        if (!publicPaths.includes(path)) {
            // check token
            request
                .get('/api/user', {})
                .then((res: any) => {
                    if (res.data.isLoggedIn) {
                        setAuthorized(true);
                    } else {
                        setAuthorized(false);
                        router.push({
                            pathname: '/login',
                        });
                    }
                });

        } else {
            setAuthorized(true);
        }
    }

    return (<>
        {authorized && children}
    </>);
}

export default RouteGuard;