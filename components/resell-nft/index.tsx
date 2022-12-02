import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useGetMarketplaceContract, useGetUserAddress } from '../../src/hook'
import { Marketplace as MarketplaceContractType } from 'contracts/src/types/contracts';

const ResellNFT = () => {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput
  const marketplaceContract: MarketplaceContractType = useGetMarketplaceContract();
  const userAddress = useGetUserAddress();

  useEffect(() => {
    fetchNFT()
  }, [id])

  const fetchNFT = async () => {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI.toString())
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  const listNFTForSale = async () => {
    if (!price || !id) return;

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    let listingPrice = await marketplaceContract.methods.getListingPrice().call();

    listingPrice = listingPrice.toString()
    await marketplaceContract.methods.resellToken(id.toString(), priceFormatted.toString()).send({ from: userAddress, value: listingPrice })
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        {
          image && (
            <img className="rounded mt-4" width="350" src={image} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          List NFT
        </button>
      </div>
    </div>
  )
}

export default ResellNFT;