import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {useIsAdmin} from "../src/hook";
import AdminLayout from "../components/layout/admin-layout";

const AdminClient = (props: any) => {
    const isAdmin = useIsAdmin();
    const {push} = useRouter();
    useEffect(() => {
        if (typeof isAdmin !== undefined && !isAdmin) {
            push("/")
        }
    }, [isAdmin]);
    return <AdminLayout {...props} />;
}

export async function getServerSideProps() {
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default AdminClient;
