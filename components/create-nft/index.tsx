import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useGetMarketplaceContract, useGetNFTStorage, useGetUserAddress } from '../../src/hook'
import { Marketplace as MarketplaceContractType } from 'contracts/src/types/contracts';
import { NFT_STORAGE_KEY } from "../../src/hook/helpers";
import { NextPage } from 'next';
import {Button, Form, Input, message, Space, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import { Typography } from 'antd';

const { Title } = Typography;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const CreateNftItem: NextPage = () => {
  const [fileUrl, setFileUrl] = useState("")
  const [form] = Form.useForm();
  const nftStorage = useGetNFTStorage();
  const router = useRouter()
  const userAddress = useGetUserAddress();
  const getMarketplaceContract = useGetMarketplaceContract();
  const listNFTForSale = async (isAuction = false) => {
    const marketplaceContract = await getMarketplaceContract();
    if(!marketplaceContract) {
      return;
    }
    const { price, name, description } = form.getFieldsValue();
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
    if(!isAuction) {
      await marketplaceContract.methods.createTokenSale(urlNFT, priceEther.toString()).send({ from: userAddress, value: listingPrice })
    } else {
      await marketplaceContract.methods.createTokenAuction(urlNFT, priceEther.toString()).send({ from: userAddress, value: listingPrice })
    }
    router.push('/')
  }

  const propsUpload = {
    name: 'file',
    action: async (file: any) => {
        const imageMetadata = await nftStorage.storeBlob(new Blob([file]));
        setFileUrl(`https://${imageMetadata}.ipfs.nftstorage.link`);
        return file;
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      }
    },
  };

  return (
    <div className={"flex justify-center flex-col max-w-[1240px] m-auto items-center min-h-[calc(100vh-57px)]"} >
      <Title>Create NFT</Title>
      <div className="w-full flex flex-col pb-12" >
        <Form {...layout} name="nest-messages" validateMessages={validateMessages} form={form}>
          <Form.Item name={'name'} label="Name" rules={[{ required: true }]}>
            <Input placeholder="Asset Name"/>
          </Form.Item>
          <Form.Item name={'price'} label="Price">
            <Input placeholder="Asset price"/>
          </Form.Item>
          <Form.Item name={"description"} label="Description">
            <Input.TextArea placeholder="Asset description"/>
          </Form.Item>
          <Form.Item name={"image"} label="Image">
            <Upload {...{
              ...propsUpload
            }}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          {
              fileUrl && (
                  <img className="rounded mt-4" width="350" src={fileUrl} />
              )
          }
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Space>
              <Button onClick={() => listNFTForSale()} type={"primary"} >
                Create NFT
              </Button>
              <Button onClick={() => listNFTForSale(true)} type={"primary"} >
                Create Auction NFT
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default CreateNftItem;
