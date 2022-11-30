import '../styles/globals.css'
import React, { useEffect } from 'react';
import { PersistGate } from "redux-persist/integration/react";
import { useDispatch, useStore } from "react-redux";
import * as t from "../src/redux/types";
import { message } from "antd";
import MarketplaceABI from "contracts/artifacts/contracts/Marketplace.sol/Marketplace.json";
import { marketplaceAddress } from "../src/common/constant";
import { useGetWeb3 } from "../src/hook";
import { AppProps } from "next/app";
import { wrapper } from '../src/redux/store';

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }: AppProps) {
  const store: any = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    const connect = async () => {
      const web3 = await useGetWeb3();
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        const userAddress = accounts[0];
        dispatch({ type: t.SET_ADDRESS, payload: { userAddress } });
      } else {
        message.error("Please connect to MetaMask");
      }
      dispatch({
        type: t.SET_MARKETPLACE_CONTRACT,
        payload: {
          marketplaceContract: new web3.eth.Contract(
            MarketplaceABI.abi,
            marketplaceAddress
          ),
        },
      });
    }
    connect();
  }, [dispatch]);


  return (
    <PersistGate
      {...{
        loading: null,
        persistor: store.__persistor,
      }}
    >
      <Component {...pageProps} />
    </PersistGate>
  )
}

export default wrapper.withRedux(MyApp);
