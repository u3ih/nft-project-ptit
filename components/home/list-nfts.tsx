import {useEffect, useMemo, useState} from "react"
import { useBuyNft, useLoadNfts } from "../../src/hook"
import React from "react";
import {doRequest} from "../../src/common/do-request";
import _ from "lodash";
import {Col, Empty, Row} from "antd";

const NftItem = (props: {nft: any}) => {
  const {nft} = props;
  const buyNft = useBuyNft();

  return (
      <Col {...{xs: 24, sm: 12, md: 6}}>
          <div className="border shadow rounded-xl overflow-hidden">
            <div className="h-[300px] flex items-center">
              <img {...{
                src: nft?.fileUrl,
                className: "object-contain"
              }} />
            </div>
            <div className="p-4">
              <p className="text-2xl font-semibold">{nft?.name}</p>
              <p className="text-gray-400">{nft?.description}</p>
            </div>
            <div className="p-4 bg-black">
              <p className="text-2xl font-bold text-white m-0">{nft?.price} ETH</p>
              <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
            </div>
          </div>
      </Col>
  )
}

const ListNFTs = () => {
  const [nfts, setNfts] = useState<any[]>([])
  const loadNfts = useLoadNfts();
  console.log("nfts: ", nfts);
  useEffect(() => {
    const handleLoadNft = async () => {
      // const items = await loadNfts()
      const items = await doRequest({url: "nfts/list-nft-sell"})
      setNfts(items);
    }
    handleLoadNft();
  }, [])

    const groupedNft = useMemo(() => {
        return _.groupBy(nfts, "userId")
    }, [nfts])
  if (!nfts.length) return (
    <div className={"mt-[40px]"}>
      <Empty description={"Không có nft nào"}/>
    </div>
  )
  return (
    <div className="flex flex-col gap-[30px] justify-center max-w-[1240px] px-4 m-auto">
          {
            Object.values(groupedNft)?.map((listNftsByUser: any, i) => {
                const {user} = listNftsByUser[0];
                console.log("listNftsByUser: ", listNftsByUser);
                return (
                    <div key={`nft-group-by-user-${i}`}>
                        <h2>User: {user?.username}</h2>
                        <Row gutter={[{xs: 12, sm: 12, md: 24}, {xs: 12, sm: 12, md: 24}]}>
                            {listNftsByUser?.map((nft: any) => (
                                <NftItem nft={nft} key={i}/>
                            ))}
                        </Row>
                    </div>
                )
            })
          }
    </div>
  )
}

export default ListNFTs;
