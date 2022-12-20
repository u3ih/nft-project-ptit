import '../styles/globals.css'
import React, { useEffect } from 'react';
import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "react-redux";
import { message } from "antd";
import {
  useGetUserAddress,
  useGetWeb3,
  useHandleFetchUserDataByAddress,
} from "../src/hook";
import { wrapper } from '../src/redux/store';

const MyComponent = ({ Component, pageProps }: any) => {
  const userAddress = useGetUserAddress();
  const fetchUserDataByAddress = useHandleFetchUserDataByAddress();
  const getWeb3 = useGetWeb3();
  useEffect(() => {
    const reConnect = async () => {
      await getWeb3();
    }
    reConnect();
  })

  useEffect(() => {
    const connect = async () => {
      if (!userAddress) {
        message.error("Please connect to MetaMask");
        return;
      }
      await fetchUserDataByAddress(userAddress);
    }
    connect();
  }, [userAddress, fetchUserDataByAddress]);
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
