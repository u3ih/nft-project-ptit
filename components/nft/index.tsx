import React, {useState} from "react";
import {useRouter} from "next/router";
import Header from "../header";
import NFTImage from "./NFTImage";
import GeneralDetails from "./GeneralDetails";
import ItemActivity from "./ItemActivity";
import {Col, Row} from "antd";

const NftDetail = (props: any) => {
    const {nftDetail} = props;
    return (
        <div className={"wrapper py-[20px]"}>
            <div className={"container"}>
                    <Row gutter={[{xs: 12, sm: 12, md: 24}, {xs: 12, sm: 12, md: 24}]}>
                        <Col {...{xs: 24, sm: 24, md: 8}}>
                            <NFTImage selectedNft={nftDetail} />
                        </Col>
                        <Col {...{xs: 24, sm: 24, md: 16}}>
                            <GeneralDetails selectedNft={nftDetail} />
                        </Col>
                    </Row>
                <ItemActivity selectedNft={nftDetail}/>
            </div>
        </div>
    )
}

export default NftDetail;
