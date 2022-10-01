import '../styles/globals.css'
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'
import React from 'react';

/**
 * The chain ID 97 to connect with bsc testnet
 * The `injected` connector is a web3 connection method used by Metamask
 */
const supportedChainIds = [97]
const connectors = {
  injected: {},
}

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <Component {...pageProps} />
    </ThirdwebWeb3Provider>
  )
}

export default MyApp
