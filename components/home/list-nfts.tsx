import { useEffect, useState } from "react"
import { marketplaceAddress } from "../../src/common/constant"
import { useBuyNft, useLoadNfts } from "../../src/hook"
import React from "react";

const ListNFTs = () => {
  const [nfts, setNfts] = useState<any[]>([])
  const loadNfts = useLoadNfts();
  const buyNft = useBuyNft();

  useEffect(() => {
    const handleLoadNft = async () => {
      const items = await loadNfts()
      setNfts(items);
    }
    handleLoadNft();
  }, [])
  if (!nfts.length) return (
    <h2 className="px-20 py-10 text-3xl">No items in marketplace</h2>
  )
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <div className="min-h-[370px] flex items-center">
                  <img src={nft?.image} />
                </div>
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft?.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft?.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft?.price} ETH</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ListNFTs;
