import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useGetNFTStorage, useGetUserAddress } from '../../src/hook'
import { NFT_STORAGE_KEY } from "../../src/hook/helpers";
import { NextPage } from 'next';
import {Button, DatePicker, Form, Input, message, Space, Switch, Upload} from "antd";
import { Typography } from 'antd';
import {useCreateNft} from "../../src/hook/nft-hook";
import dayjs from "dayjs";
import {UploadOutlined} from "@ant-design/icons";

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
  const router = useRouter();
  const createNft = useCreateNft();
  const isAuction = Form.useWatch("isAuction", form);
  const listNFTForSale = async () => {

    const { price, name, description, isAuction, duringMinute } = form.getFieldsValue();
    const timeEndAuction = dayjs().add(duringMinute, "m").valueOf();
    // Upload NFT to IPFS & Filecoin
    let metadata: any;
    await axios({
      method: 'post',
      url: 'https://api.nft.storage/upload',
      data: {
        name,
        description,
        image: fileUrl,
        isAuction,
        timeEndAuction,
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
    const newNft = {
      urlNFT,
      name,
      description,
      price,
      isAuction,
      timeEndAuction,
      fileUrl,
    }
    await createNft(newNft)
    router.push('/')
  }

  const propsUpload = {
    name: 'file',
    maxCount: 1,
    action: async (file: any) => {
        const imageMetadata = await nftStorage.storeBlob(new Blob([file]));
        setFileUrl(`https://${imageMetadata}.ipfs.nftstorage.link`);
        return `https://${imageMetadata}.ipfs.nftstorage.link`;
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
          <Form.Item name={'price'} label="Price" rules={[{ required: true }]}>
            <Input placeholder="Asset price"/>
          </Form.Item>
          <Form.Item name={"description"} label="Description">
            <Input.TextArea placeholder="Asset description"/>
          </Form.Item>
          <Form.Item name={'isAuction'} label="Auction">
            <Switch checkedChildren="Auction" unCheckedChildren="Auction" defaultChecked={false}/>
          </Form.Item>
          {isAuction && (
              <Form.Item name={'duringMinute'} label="During time">
                <Input placeholder={"minutes"}/>
              </Form.Item>
          )}
          <Form.Item name={"image"} label="Image">
            <Upload {...{
              ...propsUpload
            }}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {
                fileUrl && (
                    <img className="rounded mt-4" width="200" src={fileUrl} />
                )
            }
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Space>
              <Button onClick={() => listNFTForSale()} type={"primary"} >
                Create NFT
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default CreateNftItem;
