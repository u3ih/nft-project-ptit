import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {useIsAdmin} from "../src/hook";
import AdminLayout from "../components/layout/admin-layout";
import Head from "next/head";

const AdminClient = (props: any) => {
    const isAdmin = useIsAdmin();
    const {push} = useRouter();
    useEffect(() => {
        if (typeof isAdmin !== undefined && !isAdmin) {
            push("/")
        }
    }, [isAdmin]);
    return (
        <>
            <Head>
                <title>Admin page</title>
                <meta property="og:title" content="Admin page" key="title" />
            </Head>
            <AdminLayout {...props} />
        </>
    );
}

export async function getServerSideProps() {
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default AdminClient;
