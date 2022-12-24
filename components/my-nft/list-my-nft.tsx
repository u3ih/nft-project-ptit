import NftCard from "./nft-card";
import React from "react";
import {useGetUserData} from "../../src/hook";
import {Col, Row} from "antd";

const ListMyNft = (props: {title?: string, nfts: any[]}) => {
    const {title, nfts} = props;
    const userInfo = useGetUserData();
    return (
        <>
            {title && <h2 className="text-[40px] font-semibold my-[20px]">{title}</h2>}
            <Row gutter={[{xs: 12, sm: 12, md: 24}, {xs: 12, sm: 12, md: 24}]} >
                {
                    nfts?.map((nft: any, i: number) => (
                        <Col {...{xs: 24, sm: 12, md: 6}} key={nft?.id}>
                            <NftCard nft={nft} avatarOwner={userInfo?.imgUrl} isOwner={userInfo?.id === nft?.userId} showReListNftBtn={nft?.sold}/>
                        </Col>

                    ))
                }
            </Row>
        </>
    )
}
export default ListMyNft;
