import React, {useEffect, useState} from "react";
import {Segmented, Table} from "antd";
import {doRequest} from "../../src/common/do-request";
import dayjs from "dayjs";

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
        title: 'Thời gian',
        dataIndex: 'date',
        key: 'date',
        render: (date: any) => {
           return date && <p>{dayjs(date).format("DD/MM/YYYY hh:mm:ss")}</p>
        }
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
    const [totalVol, setTotalVol] = useState(0);
    const handleFetchTotalVol = async (time?: any) => {
        console.log("time: ", time);
        const netWorkVol = {
            url: `/transactions/statistic/${time ?? "all"}`
        }
        const {totalVol, data} = await doRequest(netWorkVol);
        setTotalVol(totalVol);
        setTransactions(data);
    }
    useEffect(() => {
        const fetchData = async () => {
            await handleFetchTotalVol()
        }
        fetchData();
    }, [])



    return (
        <div className={"flex flex-col gap-[8px] mt-[20px]"}>
            <div className={"flex gap-[15px] items-center bg-white px-[15px] py-[5px]"}>
                <p>Thống kê theo:</p>
                 <Segmented size="large" defaultValue={"all"}	options={['day', 'week', 'month', 'all']} onChange={(value) => handleFetchTotalVol(value)}/>
            </div>
            <div className={"p-[30px] rounded-[15px] bg-white"}>
                <p>Tổng số tiền giao dịch trong khoảng thời gian trên là: <span className={"text-[20px] font-bold"}>{totalVol} ETH</span> </p>
            </div>
            <Table dataSource={transactions} columns={columns} />
        </div>
    )
}

export default NFTManagement;
