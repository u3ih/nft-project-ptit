import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import MyAssets from "../components/my-nft";

const MyNft = () => {
  return (
    <MyAssets />
  )
}

MyNft.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default MyNft;