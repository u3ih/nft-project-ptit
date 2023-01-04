import React from "react";
import NftDetail from "../../components/nft";
import ClientMainLayout from "../../components/layout/client-layout";
import {doRequest} from "../../src/common/do-request";
import Head from "next/head";

const Nft = (props: any) => {
  return (
      <>
        <Head>
          <title>{props?.name}</title>
          <meta property="og:title" content={props?.name} key="title" />
        </Head>
        <NftDetail {...{
          nftDetail: props
        }}/>
      </>
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
