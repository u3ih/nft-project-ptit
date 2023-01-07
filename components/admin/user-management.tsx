import React, {useEffect, useState} from "react";
import {Input, Table} from "antd";
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
            return dateOfBirth && dayjs(dateOfBirth).format("DD/MM/YYYY, hh:mm:ss")
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
    const handlefetchUser = async (username?: string) => {
        const netWork = {
            url: `/users?username=${username ?? ''}`
        }
        const items = await doRequest(netWork)
        setUser(items);
    }
    useEffect(() => {
        handlefetchUser();
    }, [])
    return (
        <div className={"mt-[15px] flex flex-col gap-[20px]"}>
            <Input.Search
                placeholder="Nhập tên user"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handlefetchUser}
            />
            <Table dataSource={users} columns={columns} />
        </div>
    )
}

export default UserManagement;
