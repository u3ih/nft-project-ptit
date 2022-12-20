import {Avatar, Button, Dropdown, Menu, Space} from "antd";
import Link from "next/link";
import React from "react";
import { CgProfile } from "react-icons/cg";
import {useGetUserData} from "../../src/hook";
import {UserOutlined} from "@ant-design/icons";
const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href={"/user-info"}>
                            User info
                        </Link>
                    ),
                },
                // {
                //   key: '3',
                //   label: (
                //     <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                //       3rd menu item (disabled)
                //     </a>
                //   ),
                //   disabled: true,
                // },
                // {
                //   key: '4',
                //   danger: true,
                //   label: 'a danger item',
                // },
            ]}
        />
    );

const UserDropdown: React.FC = () => {
    const userInfo = useGetUserData();
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
