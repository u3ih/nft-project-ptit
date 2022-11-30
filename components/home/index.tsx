import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import { useGetUserAddress, useSetInfoAddress } from '../../src/hook';
import Header from '../header';
import Hero from '../hero';


const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

const ClientHome = () => {
  const setInfoAddress = useSetInfoAddress();
  const { userAddress } = useGetUserAddress();
  console.log("userAddress: ", userAddress);

  const welcomeUser = (userName: string, toastHandler = toast) => {
    toastHandler.success(
      `Welcome back${userName !== 'Unnamed' ? ` ${userName}` : ''}!`,
      {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      }
    )
  }

  useEffect(() => {
    if (!userAddress) return;
    (async () => {
      const userDoc = {
        _type: 'users',
        _id: userAddress,
        userName: 'Unnamed',
        walletAddress: userAddress,
      }
    })()
  }, [userAddress])

  return (
    <div className={style.wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Hero />
    </div>
  )
}

export default ClientHome;