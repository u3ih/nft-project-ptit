import {useEffect, useMemo, useState} from "react"
import { useLoadNfts } from "../../src/hook"
import React from "react";
import {doRequest} from "../../src/common/do-request";
import _ from "lodash";
import {Avatar, Col, Empty, Row} from "antd";
import NftCard from "../nft/nft-card";
import {UserOutlined} from "@ant-design/icons";

const ListNFTs = () => {
  const [nfts, setNfts] = useState<any[]>([])
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
    <div className="flex flex-col gap-[30px] justify-center max-w-[1240px] px-4 m-auto mt-[20px]">
          {
            Object.values(groupedNft)?.map((listNftsByUser: any, i) => {
                const {user} = listNftsByUser[0];
                return (
                    <div key={`nft-group-by-user-${i}`}>
                      <div className={"flex gap-[5px] mb-[10px] items-center"}>
                        <Avatar size={48} src={user?.imgUrl} icon={<UserOutlined />}/>
                        <p>{user?.username ? user?.username : user?.userAddress}</p>
                      </div>
                        <Row gutter={[{xs: 12, sm: 12, md: 24}, {xs: 12, sm: 12, md: 24}]}>
                            {listNftsByUser?.map((nft: any) => (
                                <Col {...{xs: 24, sm: 12, md: 6}} key={nft?.id}>
                                  <NftCard nft={nft} avatarOwner={user?.imgUrl}/>
                                </Col>
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
