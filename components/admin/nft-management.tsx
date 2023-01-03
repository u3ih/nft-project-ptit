import React, {useEffect, useState} from "react";
import {Table} from "antd";
import {doRequest} from "../../src/common/do-request";
import dayjs from "dayjs";

const columns = [
    {
        title: 'Ảnh',
        dataIndex: 'fileUrl',
        key: 'fileUrl',
        render: (fileUrl: string) => {
            return fileUrl && <img src={fileUrl} width={40} height={40}/>
        }
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        render: (description: string) => {
            return <p className={"line-clamp-3"}>{description}</p>
        }
    },
    {
        title: 'Chủ sở hữu',
        dataIndex: 'owner',
        key: 'owner',
    },
    {
        title: 'Mã băm',
        dataIndex: 'transactionHash',
        key: 'transactionHash',
    },
];

const NFTManagement = () => {
    const [nfts, setNFTs] = useState();
    useEffect(() => {
        const fetchUser = async () => {
            const netWork = {
                url: "/nfts/all"
            }
            const items = await doRequest(netWork)
            setNFTs(items);
        }
        fetchUser();
    }, [])
    return (
        <Table dataSource={nfts} columns={columns} />
    )
}

export default NFTManagement;
