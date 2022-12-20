import { useEffect, useState } from 'react'
import {useGetUserData, useLoadMyNfts} from '../../src/hook'
import React from "react";
import NftCard from "../nft/nft-card";

const MyAssets = () => {
  const [nfts, setNfts] = useState<any>([])
  const loadMyNfts = useLoadMyNfts();
  const userInfo = useGetUserData();
  useEffect(() => {
    loadNFTs()
  }, [])
  const loadNFTs = async () => {
    const items = await loadMyNfts();
    setNfts(items)
  }

  if (!nfts.length) return (
    <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>
  )
  return (
    <div className="max-w-[1240px] m-auto">
      <h1 className="pt-[50px] text-[40px] font-semibold">My nft</h1>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts?.map((nft: any, i: number) => (
                  <NftCard nft={nft} avatarOwner={userInfo?.imgUrl} key={i} hideBuyBtn showReListNftBtn={nft?.sold}/>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAssets;
