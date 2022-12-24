import { useEffect, useState } from 'react'
import React from "react";
import {Empty, Tabs} from "antd";
import ListMyNft from "./list-my-nft";
import {useLoadMyNfts} from "../../src/hook/nft-hook";

const MyAssets = () => {
  const [sellingNfts, setSellingNfts] = useState<any>([])
  const [boughtNfts, setBoughtNfts] = useState<any>([])
  const loadMyNfts = useLoadMyNfts();

  const loadNFTs = async () => {
    const {itemsSelling, itemsBought} = await loadMyNfts() || {};
    setSellingNfts(itemsSelling)
    setBoughtNfts(itemsBought)
  }
  useEffect(() => {
    loadNFTs()
  }, [])

  if (!sellingNfts.length && !boughtNfts.length) {
    return (
        <div className={"mt-[40px]"}>
            <Empty description={"Không có nft nào"}/>
        </div>
    )
  }
  return (
    <div className="max-w-[1240px] m-auto">
       <h1>NFT của tôi</h1>
      <Tabs
          defaultActiveKey="nft-selling"
          items={[
            {
              label: `NFT đang bán`,
              key: 'nft-selling',
              children: (
                  <ListMyNft {...{
                    nfts: sellingNfts
                  }}/>
              ),
            },
            {
              label: `Nft đã mua`,
              key: 'nft-bought',
              children: (
                  <ListMyNft {...{
                    nfts: boughtNfts
                  }}/>
              ),
            },
          ]}
      />
    </div>
  )
}

export default MyAssets;
