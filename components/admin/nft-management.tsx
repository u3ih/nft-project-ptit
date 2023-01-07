import React, {useEffect, useState} from "react";
import {Input, Table} from "antd";
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
    const handlefetchNFT = async (name?: string) => {
        const netWork = {
            url: `/nfts/all?name=${name ?? ''}`
        }
        const items = await doRequest(netWork)
        setNFTs(items);
    }
    useEffect(() => {
        handlefetchNFT();
    }, [])
    return (
        <div className={"mt-[15px] flex flex-col gap-[20px]"}>
            <Input.Search
                placeholder="Nhập tên NFT"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handlefetchNFT}
            />
            <Table dataSource={nfts} columns={columns} />
        </div>
    )
}

export default NFTManagement;
