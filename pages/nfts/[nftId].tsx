import React from "react";
import NftDetail from "../../components/nft";
import ClientMainLayout from "../../components/layout/client-layout";
import {doRequest} from "../../src/common/do-request";

const Nft = (props: any) => {
  return (
    <NftDetail nftDetail={props}/>
  )
}

Nft.Layout = ClientMainLayout;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getServerSideProps = async ({ query }) => {
  const { nftId } = query;
  const network = {
    url: `nfts/${nftId}`
  }
  const props = await doRequest(network);
  return {
    props: {
      ...props,
    },
  };
};

export default Nft
