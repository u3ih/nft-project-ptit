import Header from '../components/header';
import Hero from "../components/hero";
import { useEffect } from 'react';
import { client } from '../lib/sanityClient';
import toast, { Toaster } from 'react-hot-toast';
import React from 'react';
import { useGetUserAddress, useSetInfoAddress } from '../src/hook';

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

export default function Home() {
  const setInfoAddress = useSetInfoAddress();
  const userAddress = useGetUserAddress();
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

      const result = await client.createIfNotExists(userDoc)

      welcomeUser(result.walletAddress)
    })()
  }, [userAddress])

  return (
    <div className={style.wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      {userAddress ? (
        <>
          <Header />
          <Hero />
        </>
      ) : (
        <div className={style.walletConnectWrapper}>
          <button
            className={style.button}
          // onClick={() => connectWallet('injected')}
          >
            Connect Wallet
          </button>
          <div className={style.details}>
            You need Chrome to be
            <br /> able to run this app.
          </div>
        </div>
      )}
    </div>
  )
}
