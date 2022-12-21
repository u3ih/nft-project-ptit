import React, {useState} from "react";
import {useRouter} from "next/router";
import Header from "../header";
import NFTImage from "./NFTImage";
import GeneralDetails from "./GeneralDetails";
import ItemActivity from "./ItemActivity";

const style = {
    wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
    container: `container p-6`,
    topContent: `flex`,
    nftImgContainer: `flex-1 mr-4`,
    detailsContainer: `flex-[2] ml-4`,
}

const NftDetail = (props: any) => {
    const {nftDetail} = props;
    const router = useRouter()
console.log("nftDetail: ", nftDetail);
    return (
        <div>
            <div className={style.wrapper}>
                <div className={style.container}>
                    <div className={style.topContent}>
                        <div className={style.nftImgContainer}>
                            <NFTImage selectedNft={nftDetail} />
                        </div>
                        <div className={style.detailsContainer}>
                            <GeneralDetails selectedNft={nftDetail} />
                            {/* <Purchase
                isListed={router.query.isListed}
                selectedNft={selectedNft}
                listings={listings}
                marketPlaceModule={marketPlaceModule}
              /> */}
                        </div>
                    </div>
                    <ItemActivity />
                </div>
            </div>
        </div>
    )
}

export default NftDetail;
