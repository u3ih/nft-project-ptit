import '../styles/globals.css'
import React, { useEffect } from 'react';
import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "react-redux";
import {ConfigProvider, message} from "antd";
import {
  useGetUserAddress,
  useGetWeb3,
  useHandleFetchUserDataByAddress,
} from "../src/hook";
import { wrapper } from '../src/redux/store';
import {useConnectSocket, useGetSocket} from "../src/hook/socket-hook";

const MyComponent = ({ Component, pageProps }: any) => {
  const userAddress = useGetUserAddress();
  const fetchUserDataByAddress = useHandleFetchUserDataByAddress();
  const getWeb3 = useGetWeb3();
  const connectSocket = useConnectSocket();
  const socket = useGetSocket();

  useEffect(() => {
    const reConnect = async () => {
      await getWeb3();
      await connectSocket();
    }
    reConnect();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    }
  }, [])

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
      <ConfigProvider theme={{ hashed: false }}>
        <PageLayout>
          <MyComponent {...{ Component, pageProps }} />
        </PageLayout>
      </ConfigProvider>
    </PersistGate>
  )
}

export default wrapper.withRedux(MyApp);
