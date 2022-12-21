import React, {useEffect, useState} from "react";
import {useLoadAuctionNfts, useLoadMyNfts} from "../../src/hook";
import {Empty, Tabs} from "antd";
import ListMyNft from "../my-nft/list-my-nft";

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

    if (!itemsAuction.length && !itemsMyAuction.length) {
        return (
            <Empty />
        )
    }
    return (
        <div className="max-w-[1240px] m-auto">
            <Tabs
                defaultActiveKey="auction-nft-selling"
                items={[
                    {
                        label: `NFT đang đấu giá`,
                        key: 'auction-nft-selling',
                        children: (
                            <ListMyNft {...{
                                nfts: itemsAuction
                            }}/>
                        ),
                    },
                    {
                        label: `Nft bạn đã đấu giá`,
                        key: 'auction-nft-bought',
                        children: (
                            <ListMyNft {...{
                                nfts: itemsMyAuction
                            }}/>
                        ),
                    },
                    {
                        label: `Nft đấu giá của bạn`,
                        key: 'auction-my-nft',
                        children: (
                            <ListMyNft {...{
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
