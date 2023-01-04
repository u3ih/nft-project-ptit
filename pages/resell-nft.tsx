import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import ResellNFT from "../components/resell-nft";
import Head from "next/head";

const ResellNft = () => {
  return (
      <>
        <Head>
          <title>Resell NFT</title>
          <meta property="og:title" content="Resell NFT" key="title" />
        </Head>
        <ResellNFT />
      </>
  )
}

ResellNft.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default ResellNft;
