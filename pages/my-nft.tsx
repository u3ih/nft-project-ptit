import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import MyAssets from "../components/my-nft";
import Head from "next/head";

const MyNft = () => {
  return (
      <>
        <Head>
          <title>My NFT</title>
          <meta property="og:title" content="My NFT" key="title" />
        </Head>
        <MyAssets />
      </>
  )
}

MyNft.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default MyNft;
