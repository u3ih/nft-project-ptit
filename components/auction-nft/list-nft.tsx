import NftCard from "../my-nft/nft-card";
import React from "react";

const ListNft = (props: { avatarOwner?: string, isOwner?: boolean, nfts: any }) => {
    const {avatarOwner, isOwner = false, nfts} = props;
    return (
        <div className="flex justify-center p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                    nfts?.map((nft: any, i: number) => {
                        const avatar = avatarOwner || nft?.user?.imgUrl;
                        return (
                            <NftCard nft={nft} avatarOwner={avatar} key={i} isOwner={isOwner} showReListNftBtn={nft?.sold}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ListNft;
