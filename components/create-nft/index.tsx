import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useGetMarketplaceContract, useGetNFTStorage } from '../../src/hook'
import { MarketplaceContractType } from 'contracts/src/types/contracts';
import { NFT_STORAGE_KEY } from "../../src/hook/helpers";
import { NextPage } from 'next';

const slugify = (value: string) => {
  return value.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

const CreateNftItem: NextPage = () => {
  const [fileUrl, setFileUrl] = useState("")
  const [fileType, setFileType] = useState("")
  const [file, setFile] = useState()
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const nftStorage = useGetNFTStorage();
  const router = useRouter()
  const marketplaceContract: MarketplaceContractType = useGetMarketplaceContract();

  const onChange = async (e: any) => {
    const file = e.target.files[0];

    try {
      const imageMetadata = await nftStorage.storeBlob(new Blob([file]));
      setFileUrl(`https://${imageMetadata}.ipfs.nftstorage.link`);
      setFileType(file?.type)
      setFile(file);
    } catch (error) {
      console.log(error);
    }
  }
  console.log("fileUrl: ", fileUrl)
  const listNFTForSale = async () => {
    const { price, name, description } = formInput
    // Upload NFT to IPFS & Filecoin

    let metadata: any;
    await axios({
      method: 'post',
      url: 'https://api.nft.storage/upload',
      data: {
        name,
        description,
        image: fileUrl,
      },
      headers: { 'Authorization': `Bearer ${NFT_STORAGE_KEY}` }
    }).then(function (response) {
      metadata = response;
    })
      .catch(function (error) {
        console.log(error);
      });
    const urlNFT = `https://${metadata?.data?.value?.cid}.ipfs.nftstorage.link`

    /* next, create the item */
    const priceEther = ethers.utils.parseUnits(price, 'ether')
    let listingPrice = await marketplaceContract.methods.getListingPrice().call();
    listingPrice = listingPrice.toString()
    await marketplaceContract.methods.createToken(urlNFT, priceEther as any).send({ value: listingPrice })
    console.log("listingPrice: ", listingPrice);

    router.push('/')
  }

  return (
    <div className={"flex justify-center"} >
      <div className="w-1/2 flex flex-col pb-12" >
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" >
          Create NFT
        </button>
      </div>
    </div>
  )
}

export default CreateNftItem;