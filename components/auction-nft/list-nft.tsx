import NftCard from "../my-nft/nft-card";
import React from "react";
import {Col, Row} from "antd";

const ListNft = (props: { avatarOwner?: string, isOwner?: boolean, nfts: any }) => {
    const {avatarOwner, isOwner = false, nfts} = props;
    return (
        <Row gutter={[{xs: 12, sm: 12, md: 24}, {xs: 12, sm: 12, md: 24}]}>
                {
                    nfts?.map((nft: any, i: number) => {
                        const avatar = avatarOwner || nft?.user?.imgUrl;
                        return (
                            <Col {...{xs: 24, sm: 12, md: 6}} key={nft?.id} >
                                <NftCard nft={nft} avatarOwner={avatar} isOwner={isOwner} showReListNftBtn={nft?.sold}/>
                            </Col>
                        )
                    })
                }
        </Row>
    )
}

export default ListNft;
