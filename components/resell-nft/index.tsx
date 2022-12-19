import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useGetMarketplaceContract, useGetUserAddress } from '../../src/hook'
import {Button, Form, Input, Space, Upload} from "antd";

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

const ResellNFT = () => {
  const router = useRouter()
  const { id, tokenURI } = router.query
  const getMarketplaceContract = useGetMarketplaceContract();
  const userAddress = useGetUserAddress();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNFT()
  }, [id])

  const fetchNFT = async () => {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI.toString())
    form.setFieldValue("image", meta.data.image);
  }

  const listNFTForSale = async () => {
    const marketplaceContract = await getMarketplaceContract()
    const {price, image} = form.getFieldsValue();
    if (!price || !id || !marketplaceContract) return;
    const priceFormatted = ethers.utils.parseUnits(price, 'ether')
    let listingPrice = await marketplaceContract.methods.getListingPrice().call();

    listingPrice = listingPrice.toString()
    await marketplaceContract.methods.resellToken(id.toString(), priceFormatted.toString()).send({ from: userAddress, value: listingPrice })
    router.push('/')
  }

  return (
    <div className="flex justify-center flex-col max-w-[1240px] m-auto items-center min-h-[calc(100vh-57px)]">
      <div className="w-1/2 flex flex-col pb-12 mt-[40px]">
        <Form {...layout} name="nest-messages" validateMessages={validateMessages} form={form}>
          <Form.Item name={'price'} label="Name" rules={[{ required: true }]}>
            <Input placeholder="Asset Price in Eth"/>
          </Form.Item>
              <img className="rounded mt-4" width="350" src={form.getFieldValue("image")} />
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Space>
              <Button onClick={listNFTForSale} type={"primary"} className={"mt-[15px]"}>
                List NFT
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default ResellNFT;
