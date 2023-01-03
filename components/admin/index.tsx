import React, { useState } from 'react';
import dynamic from "next/dynamic";
import NFTManagement from "./nft-management";
import StatisticManagement from "./statistic";

export const UserManagement = dynamic(
    () => import("./user-management"),
    { ssr: false },
);

const AdminPage = (props: any) => {
    const {current} = props;
    const component: any = {
        "user-management": <UserManagement />,
        "nft-management": <NFTManagement />,
        "transaction-management": <StatisticManagement />
    }
    return (
        <>
            {component[current]}
        </>
    );
};

export default AdminPage;
