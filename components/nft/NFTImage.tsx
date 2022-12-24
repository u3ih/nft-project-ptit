import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'
import React from "react";

const NFTImage = (props: any) => {
  const { selectedNft } = props;
  console.log("selectedNft: ", selectedNft);
  return (
    <div className={"rounded-2xl overflow-hidden shadow-md "}>
      <div className={"flex justify-center items-center"}>
          <a href={selectedNft?.fileUrl} target={"_blank"} rel="noreferrer">
            <img src={selectedNft?.fileUrl} className={"max-w-full max-h-full"}/>
          </a>
      </div>
        <div className={"bg-[#ffffff] p-2 rounded-t-lg"}>
            <div className={"flex items-center"}>
                <IoMdSnow />
                <div className={"flex-1 flex items-center justify-end"}>
                    <AiOutlineHeart />
                    2.3K
                </div>
            </div>
        </div>
    </div>
  )
}

export default NFTImage
