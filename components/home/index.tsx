import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import Hero from '../hero';
import ListNFTs from './list-nfts';

const ClientHome = () => {
  return (
    <div className={"mb-[50px]"}>
      <Toaster position="top-center" reverseOrder={false} />
      <Hero />
      <ListNFTs />
    </div>
  )
}

export default ClientHome;
