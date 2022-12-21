import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import AuctionNftClient from "../components/auction-nft";

const AuctionNft = () => {
    return (
        <AuctionNftClient />
    )
}

AuctionNft.Layout = ClientMainLayout;

export async function getStaticProps() {
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default AuctionNft;
