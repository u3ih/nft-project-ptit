import {useEffect, useState} from 'react';
import React from "react";
import {doRequest} from "../../src/common/do-request";
import {Table} from "antd";
import dayjs from "dayjs";

const columns: any = [
  {
    title: 'Từ',
    dataIndex: 'from',
  },
  {
    title: 'Tới',
    dataIndex: 'to',
  },
  {
    title: 'Hành động',
    dataIndex: 'type',
  },
  {
    title: 'Số tiền',
    dataIndex: 'price',
    defaultSortOrder: 'descend',
    sorter: (a: string, b: string) => Number(a) - Number(b),
    render: (price: any) => {
      return `${price} ETH`
    }
  },
  {
    title: 'Thời gian',
    dataIndex: 'date',
    render: (date: any) => {
      return dayjs(date).format("DD/MM/YYYY, hh:mm:ss")
    }
  },
];

const ItemActivity = (props: any) => {
  const {selectedNft} = props;
  const [transacionNfts, setTransactionNfts] = useState([]);
  useEffect(() => {
    const fetchTransaction = async () => {
      const network = {
        url: `transactions/nft-detail/${selectedNft?.id}`
      }
      const res = await doRequest(network);
      console.log("res: ", res);
      setTransactionNfts(res)
    }
    fetchTransaction();
  }, [selectedNft])
  return (
    <div className={"w-full mt-8 border border-[#151b22] rounded-xl overflow-hidden"}>
      <h2>Lich sử Nft</h2>
      <Table columns={columns} dataSource={transacionNfts} />
    </div>
  )
}

export default ItemActivity
