import {Avatar, Button, Dropdown, Menu, Space} from "antd";
import Link from "next/link";
import React from "react";
import {useGetUserData, useIsAdmin} from "../../src/hook";
import {UserOutlined} from "@ant-design/icons";
const useMenu = () => {
    const isAdmin = useIsAdmin();
    const items = [
        {
            key: '1',
            label: (
                <Link href={"/user-info"}>
                    User info
                </Link>
            ),
        },
    ];
    if(isAdmin) {
        items.push({
            key: '2',
            label: (
                <Link href={"/admin"}>
                    Admin
                </Link>
            ),
        })
    }
    return (
        <Menu {...{
            items
        }}/>
    );
}

const UserDropdown: React.FC = () => {
    const userInfo = useGetUserData();
    const menu = useMenu();

    return (
        <Dropdown overlay={menu}>
            <div className={"flex gap-[10px] justify-center items-center"}>
                <Avatar size={32} src={userInfo?.imgUrl} icon={<UserOutlined />}/>
                <p className={"text-[14px] m-0"}>{userInfo?.username}</p>
            </div>
        </Dropdown>
    );
}

export default UserDropdown;
