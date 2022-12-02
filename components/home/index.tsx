import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import { useGetUserAddress, useSetInfoAddress } from '../../src/hook';
import Header from '../header';
import Hero from '../hero';
import ListNFTs from './list-nfts';


const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

const ClientHome = () => {
  return (
    <div className={style.wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      <Hero />
      <ListNFTs />
    </div>
  )
}

export default ClientHome;