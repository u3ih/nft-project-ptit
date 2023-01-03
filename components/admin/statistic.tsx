import React, {useEffect, useState} from "react";
import {Table} from "antd";
import {doRequest} from "../../src/common/do-request";

const columns = [
    {
        title: 'Từ',
        dataIndex: 'from',
        key: 'from',
    },
    {
        title: 'Đến',
        dataIndex: 'to',
        key: 'to',
    },
    {
        title: 'Số tiền',
        dataIndex: 'price',
        key: 'price',
        render: (price: string, record: any) => {
            return <p className={"line-clamp-3"}>{price} {record?.symbol}</p>
        }
    },
    {
        title: 'Loại',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'NFT id',
        dataIndex: 'nftId',
        key: 'nftId',
    },
];

const NFTManagement = () => {
    const [transactions, setTransactions] = useState();
    console.log("transactions: ", transactions);
    useEffect(() => {
        const fetchUser = async () => {
            const netWork = {
                url: "/transactions"
            }
            const items = await doRequest(netWork)
            setTransactions(items);
        }
        fetchUser();
    }, [])
    return (
        <Table dataSource={transactions} columns={columns} />
    )
}

export default NFTManagement;
