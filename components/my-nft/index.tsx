import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Marketplace from 'contracts/artifacts/contracts/Marketplace.sol/Marketplace.json'
import { marketplaceAddress } from '../../src/common/constant'
import { useGetMarketplaceContract, useGetUserAddress, useLoadMyNfts } from '../../src/hook'
import React from "react";
import { Marketplace as MarketplaceContractType } from 'contracts/src/types/contracts';

const MyAssets = () => {
  const [nfts, setNfts] = useState<any>([])
  const router = useRouter()
  const loadMyNfts = useLoadMyNfts();
  useEffect(() => {
    loadNFTs()
  }, [])
  const loadNFTs = async () => {
    const items = await loadMyNfts();
    setNfts(items)
  }
  function listNFT(nft: any) {
    console.log('nft:', nft)
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
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
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <img src={nft.image} className="rounded" />
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                    <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => listNFT(nft)}>List</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAssets;
