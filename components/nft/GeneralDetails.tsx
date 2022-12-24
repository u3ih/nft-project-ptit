import { MdRefresh } from 'react-icons/md';
import { RiShareBoxLine } from 'react-icons/ri';
import { GiShare } from 'react-icons/gi';
import React, {useEffect, useMemo} from 'react';
import {useRouter} from "next/router";
import {FacebookShareButton, FacebookShareCount} from "react-share";
import {message} from "antd";

const GeneralDetails = (props: any) => {
  const { selectedNft } = props;
  const {reload} = useRouter();
    const url = useMemo(() => {
        if(typeof window === "undefined") {
            return "";
        }
        return window.location.href;
    }, [window])
  const handleCopyLink = () => {
      navigator.clipboard.writeText(url).then(function() {
          message.success('Copied!');
      });
  };

  return (
    <div className={"flex"}>
      <div className={"h-36 flex flex-col flex-1 justify-between mb-6"}>
        <div className={"text-[#2081e2]"}>{selectedNft?.user?.username} <span className={"text-[12px] text-[#333333]"}>({selectedNft?.user?.userAddress?.slice(0,8)}...)</span></div>
        <div className={"text-3xl font-extrabold"}>{selectedNft?.name}</div>
        <div className={"flex"}>
          <p className={"flex items-center text-[#8a939b]"}>
              {selectedNft?.description}
          </p>
        </div>
      </div>
      <div className={"w-44"}>
        <div className={"flex container justify-between text-[1.4rem] border-2 rounded-lg"}>
          <ItemDetail icon={<MdRefresh />} onClick={() => reload()}/>
            <FacebookShareButton url={url}>
                <ItemDetail icon={<RiShareBoxLine />} />
            </FacebookShareButton>
          <ItemDetail icon={<GiShare />} onClick={handleCopyLink}/>
        </div>
      </div>
    </div>
  )
}

const ItemDetail = (props: any) => {
  const { icon, onClick } = props;
  return (
      <div className={"my-2 hover:cursor-pointer"} onClick={onClick}>
        {icon}
      </div>
  )
}

export default GeneralDetails
