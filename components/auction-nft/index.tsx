import React, {useEffect, useState} from "react";
import {Empty, Tabs} from "antd";
import ListMyNft from "../my-nft/list-my-nft";
import {useLoadAuctionNfts} from "../../src/hook/nft-hook";
import ListNft from "./list-nft";

const AuctionNftClient = () => {
    const [itemsAuction, setItemsAuction] = useState<any>([])
    const [itemsMyAuction, setItemsMyAuction] = useState<any>([])
    const [itemsMyBuyingAuction, setItemsMyBuyingAuction] = useState<any>([])
    const loadAuctionNfts = useLoadAuctionNfts();

    const loadNFTs = async () => {
        const {itemsAuction, itemsMyAuction, itemsMyBuyingAuction} = await loadAuctionNfts() || {};
        setItemsAuction(itemsAuction)
        setItemsMyAuction(itemsMyAuction)
        setItemsMyBuyingAuction(itemsMyBuyingAuction)
    }
    useEffect(() => {
        loadNFTs()
    }, [])

    if (!itemsAuction.length && !itemsMyAuction.length && !itemsMyBuyingAuction.length) {
        return (
            <div className={"mt-[40px]"}>
                <Empty description={"Không có nft nào"}/>
            </div>
        )
    }
    return (
        <div className="max-w-[1240px] m-auto">
            <h1>Auction NFT</h1>
            <Tabs
                defaultActiveKey="auction-nft-selling"
                items={[
                    {
                        label: `NFT đang trên sàn`,
                        key: 'auction-nft-selling',
                        children: (
                            <ListNft {...{
                                nfts: itemsAuction
                            }}/>
                        ),
                    },
                    {
                        label: `Nft đấu giá bạn đã tạo`,
                        key: 'auction-nft-bought',
                        children: (
                            <ListMyNft {...{
                                nfts: itemsMyAuction
                            }}/>
                        ),
                    },
                    {
                        label: "Nft bạn đã đặt giá",
                        key: 'auction-my-nft',
                        children: (
                            <ListNft {...{
                                nfts: itemsMyBuyingAuction
                            }}/>
                        ),
                    },
                ]}
            />
        </div>
    )
}

export default AuctionNftClient;
