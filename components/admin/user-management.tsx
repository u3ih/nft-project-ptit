import React, {useEffect, useState} from "react";
import {Table} from "antd";
import {doRequest} from "../../src/common/do-request";
import dayjs from "dayjs";

const columns = [
    {
        title: 'Avatar',
        dataIndex: 'imgUrl',
        key: 'imgUrl',
        render: (imgUrl: string) => {
            return imgUrl && <img src={imgUrl} width={40} height={40}/>
        }
    },
    {
        title: 'Name',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'Ngày sinh',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        render: (dateOfBirth: any) => {
            return dayjs(dateOfBirth).format("DD/MM/YYYY, hh:mm:ss")
        }
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Địa chỉ ví',
        dataIndex: 'userAddress',
        key: 'userAddress',
    },
];

const UserManagement = () => {
    const [users, setUser] = useState();
    useEffect(() => {
        const fetchUser = async () => {
            const netWork = {
                url: "/users"
            }
            const items = await doRequest(netWork)
            setUser(items);
        }
        fetchUser();
    }, [])
    return (
        <Table dataSource={users} columns={columns} />
    )
}

export default UserManagement;
