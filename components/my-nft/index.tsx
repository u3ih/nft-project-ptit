import { useEffect, useState } from 'react'
import {useLoadMyNfts} from '../../src/hook'
import React from "react";
import {Empty, Tabs} from "antd";
import ListMyNft from "./list-my-nft";

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
        <Empty />
    )
  }
  return (
    <div className="max-w-[1240px] m-auto">
      <Tabs
          defaultActiveKey="nft-selling"
          items={[
            {
              label: `NFT đang bán`,
              key: 'nft-selling',
              children: (
                  <ListMyNft {...{
                    title: "NFT đang bán",
                    nfts: sellingNfts
                  }}/>
              ),
            },
            {
              label: `Nft đã mua`,
              key: 'nft-bought',
              children: (
                  <ListMyNft {...{
                    title: "Nft đã mua",
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
