import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import CreateNftItem from "../components/create-nft";
import Head from "next/head";

const CreateNft = () => {
  return (
      <>
        <Head>
          <title>Create NFT</title>
          <meta property="og:title" content="Create NFT" key="title" />
        </Head>
        <CreateNftItem />
      </>
  )
}

CreateNft.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default CreateNft;
