import NftCard from "./nft-card";
import React from "react";
import {useGetUserData} from "../../src/hook";

const ListMyNft = (props: {title?: string, nfts: any[]}) => {
    const {title, nfts} = props;
    const userInfo = useGetUserData();
    return (
        <>
            {title && <h2 className="text-[40px] font-semibold my-[20px]">{title}</h2>}
            <div className="flex justify-center">
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        {
                            nfts?.map((nft: any, i: number) => (
                                <NftCard nft={nft} avatarOwner={userInfo?.imgUrl} key={i} isOwner={userInfo?.id === nft?.userId} showReListNftBtn={nft?.sold}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default ListMyNft;
