import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import CreateNftItem from "../components/create-nft";

const CreateNft = () => {
  return (
    <CreateNftItem />
  )
}

CreateNft.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default CreateNft;