import React from "react";
import {useBuyNft, useGetUserData} from "../../src/hook";
import styles from "./nft.module.scss";
import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";

const NftCard = (props: {nft: any, hideBuyBtn?: boolean, avatarOwner: string, showReListNftBtn?: string}) => {
  const {nft, avatarOwner, hideBuyBtn = false, showReListNftBtn = false} = props;
  const buyNft = useBuyNft();
    const router = useRouter()

    const listNFT = (nft: any) => {
        router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
    }
  return (
        <div className={styles["wrapper-nft-card"]}>
          <div className="max-h-[300px] flex items-center max-w-full  relative mb-[20px]">
            <img {...{
              src: nft?.fileUrl ?? "/assets/images/default-nft-img.webp",
              className: "object-contain max-w-full overflow-hidden rounded-[10px]"
            }} />
              <div className={"absolute left-[10px] -bottom-[20px]"}>
                  <Avatar size={48} src={avatarOwner} icon={<UserOutlined />}/>
              </div>
          </div>
          <div className={"flex gap-[10px] justify-between pb-[10px] pt-[15px]"}>
            <div className="">
              <p className="text-2xl font-semibold text-darker leading-[1]">{nft?.name} <span className={"text-[#666666] text-[14px]"}>#{nft?.tokenId || "TokenId"}</span></p>
              {/*<p className="text-gray-400 mt-[4px]">{nft?.description}</p>*/}
              <p className="text-gray-400 mt-[8px]">{nft?.price} ETH</p>
            </div>
            <div className="">
              {!hideBuyBtn && <button className="mt-4 w-full bg-[#ff9614de] text-white font-bold py-2 px-12 rounded-[10px] border-0 hover:cursor-pointer hover:opacity-50 transition ease-in-out duration-300" onClick={() => buyNft(nft)}>Mua</button>}
            </div>
          </div>
            {showReListNftBtn && <button className="mt-4 w-full bg-[#ff9614de] text-white font-bold py-2 px-12 rounded-[10px] border-0 hover:cursor-pointer hover:opacity-50 transition ease-in-out duration-300" onClick={() => listNFT(nft)}>Mở bán</button>}
        </div>
  )
}

export default NftCard;
