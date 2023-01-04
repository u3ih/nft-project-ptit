import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import AuctionNftClient from "../components/auction-nft";
import Head from "next/head";

const AuctionNft = () => {
    return (
        <>
            <Head>
                <title>Auction NFT</title>
                <meta property="og:title" content="Auction NFT" key="title" />
            </Head>
            <AuctionNftClient />
        </>
    )
}

AuctionNft.Layout = ClientMainLayout;

export async function getStaticProps() {
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default AuctionNft;
