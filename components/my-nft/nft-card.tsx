import React, {useMemo, useState} from "react";
import styles from "./my-nft.module.scss";
import {Avatar, Form, Input, InputNumber, message, Modal, Tooltip} from "antd";
import {FireOutlined, UserOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import dayjs from "dayjs";
import Countdown from 'react-countdown';
import Link from "next/link";
import {useAuctionNft, useBuyNft} from "../../src/hook/nft-hook";

const NftCard = (props: {nft: any, isOwner?: boolean, avatarOwner: string, showReListNftBtn?: string}) => {
  const {nft, avatarOwner, isOwner = false, showReListNftBtn = false} = props;
  const buyNft = useBuyNft();
  const auctionNft = useAuctionNft();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const handleAuctionNft = async (nft: any) => {
      await form.validateFields();
    const auctionPrice = form.getFieldValue("auctionPrice");
    window.location.href = "/auction-nft"
    try {
    await auctionNft({...nft, auctionPrice})
    setVisible(false);
    message.success("Thành công")
    } catch (e: any) {
        message.error(e?.message);
    }
  };
    const router = useRouter()
    const {timeEndAuction, isAuction = false} = nft;
    const listNFT = (nft: any) => {
        router.push(`/resell-nft?id=${nft.id}&tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
    }
    const minPrice = useMemo(() => {
        return Number(nft?.price) + Number(nft?.minJumpPrice);
    }, [nft])

  return (
        <div className={styles["wrapper-nft-card"]}>
            <Link href={`nfts/${nft?.id}`}>
                <a className={styles["wrapper-img-nft"]}>
                    <div className="h-[200px] flex items-center max-w-full justify-center relative mb-[20px]">
                        <img {...{
                            src: nft?.fileUrl ?? "/assets/images/default-nft-img.webp",
                            className: "object-contain max-w-full overflow-hidden rounded-[10px] max-h-full"
                        }} />
                        <div className={"absolute left-[10px] -bottom-[20px]"}>
                            <Avatar size={48} src={avatarOwner} icon={<UserOutlined />}/>
                        </div>
                        {isAuction && (
                            <div className={"absolute right-0 top-0"}>
                                <Tooltip placement="top" title="Sản phẩm đấu giá">
                                    <FireOutlined style={{ fontSize: '30px', color: '#ffffff' }}/>
                                </Tooltip>
                            </div>
                        )}
                        <div className={styles["ether-icon"]}>
                            <Tooltip placement="top" title="ETH">
                            <img src={"/assets/images/ether.png"}/>
                            </Tooltip>
                        </div>
                    </div>
                </a>
            </Link>

          <div className={"flex gap-[10px] justify-between pb-[10px] pt-[15px]"}>
            <div className="">
              <p className="text-2xl font-semibold text-darker leading-[1]">{nft?.name} <p className={"text-[#666666] text-[14px] mt-[4px]"}>#{nft?.tokenId || "TokenId"}</p></p>
              {/*<p className="text-gray-400 mt-[4px]">{nft?.description}</p>*/}
              <p className="text-gray-400 mt-[8px]">{nft?.price} ETH</p>
            </div>
              <div>
                {isAuction && (
                    <div className={"flex flex-col gap-[5px] whitespace-nowrap"}>
                        <p>Kết thúc sau:</p>
                        <Countdown {...{
                            date: dayjs(timeEndAuction).toISOString(),
                        }}/>
                    </div>
                )}
              {!isOwner && !isAuction && <button className="mt-4 w-full bg-[#ff9614de] text-white font-bold py-2 px-12 rounded-[10px] border-0 hover:cursor-pointer hover:opacity-50 transition ease-in-out duration-300" onClick={() => buyNft(nft)}>Mua</button>}
              </div>
          </div>
            {showReListNftBtn && <button className="mt-4 w-full bg-[#ff9614de] text-white font-bold py-2 px-12 rounded-[10px] border-0 hover:cursor-pointer hover:opacity-50 transition ease-in-out duration-300" onClick={() => listNFT(nft)}>Mở bán lại</button>}
            {!isOwner && isAuction && (
                <button className="mt-4 w-full bg-[#ff9614de] text-white font-bold py-2 px-12 rounded-[10px] border-0 hover:cursor-pointer hover:opacity-50 transition ease-in-out duration-300" onClick={() => setVisible(true)}>Đấu giá</button>
            )}
            <Modal title="Đặt giá" open={visible} onOk={() => handleAuctionNft(nft)} onCancel={() => setVisible(false)}>
                <Form form={form} layout={"vertical"} >
                    <Form.Item name={'auctionPrice'} label={`Auction price (min: ${minPrice} ETH)`} rules={[{ required: true }]}>
                        <InputNumber placeholder="Price" min={minPrice}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
  )
}

export default NftCard;
