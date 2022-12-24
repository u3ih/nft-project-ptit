import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {Button, Form, Input, Space, Upload} from "antd";
import {useResellNft} from "../../src/hook/nft-hook";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
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
  const { id, tokenId, tokenURI } = router.query
  const [form] = Form.useForm();
  const resellNft = useResellNft();
  useEffect(() => {
    fetchNFT()
  }, [id])

  const fetchNFT = async () => {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI.toString())
    form.setFieldValue("image", meta.data.image);
  }

  const listNFTForSale = async () => {
    const {price} = form.getFieldsValue();
    await resellNft({id, tokenId, price})
  }

  return (
    <div className="flex justify-center flex-col max-w-[1240px] m-auto items-center min-h-[calc(100vh-57px)]">
      <div className="w-1/2 flex flex-col pb-12 mt-[40px] justify-center items-center">
        <img className="rounded mb-4 margin-auto" width="350" src={form.getFieldValue("image")} />
        <Form {...layout} name="nest-messages" validateMessages={validateMessages} form={form}>
          <Form.Item name={'price'} label="Name" rules={[{ required: true }]}>
            <Input placeholder="Asset Price in Eth"/>
          </Form.Item>
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
