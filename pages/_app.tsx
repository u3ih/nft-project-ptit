import '../styles/globals.css'
import React, { useEffect } from 'react';
import { PersistGate } from "redux-persist/integration/react";
import { useDispatch, useStore } from "react-redux";
import * as t from "../src/redux/types";
import { message } from "antd";
import MarketplaceABI from "contracts/artifacts/contracts/Marketplace.sol/Marketplace.json";
import { marketplaceAddress } from "../src/common/constant";
import { useGetUserAddress, useGetWeb3 } from "../src/hook";
import { AppProps } from "next/app";
import { wrapper } from '../src/redux/store';

const MyComponent = ({ Component, pageProps }: any) => {
  const getWeb3 = useGetWeb3();
  const dispatch = useDispatch();
  const userAddress = useGetUserAddress();
  useEffect(() => {
    const connect = async () => {
      const web3 = await getWeb3();
      if (!userAddress) {
        message.error("Please connect to MetaMask");
        return;
      }
      if (!web3) {
        return;
      }
      dispatch({
        type: t.SET_MARKETPLACE_CONTRACT,
        payload: {
          marketplaceContract: new web3.eth.Contract(
            MarketplaceABI.abi as any,
            marketplaceAddress
          ),
        },
      });
    }
    connect();
  }, []);
  return (
    <Component {...pageProps} />
  )
}

const emptyLayout = (props: any) => {
  const { children } = props;
  return (
    <div>{children}</div>
  );
};

// eslint-disable-next-line react/prop-types
function MyApp(_props: { Component: any; pageProps: any; }) {
  const store: any = useStore();
  const { Component, pageProps } = _props;
  const PageLayout = Component.Layout || emptyLayout

  return (
    <PersistGate
      {...{
        loading: null,
        persistor: store.__persistor,
      }}
    >
      <PageLayout>
        <MyComponent {...{ Component, pageProps }} />
      </PageLayout>
    </PersistGate>
  )
}

export default wrapper.withRedux(MyApp);
