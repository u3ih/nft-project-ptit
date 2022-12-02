import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import ResellNFT from "../components/resell-nft";

const ResellNft = () => {
  return (
    <ResellNFT />
  )
}

ResellNft.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default ResellNft;