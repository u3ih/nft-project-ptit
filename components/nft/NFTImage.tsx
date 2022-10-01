import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'
import React from "react";

const NFTImage = (props: any) => {
  const { selectedNft } = props;
  return (
    <>
      <div className={"bg-[#303339] p-2 rounded-t-lg border-[#151c22] border"}>
        <div className={"flex items-center"}>
          <IoMdSnow />
          <div className={"flex-1 flex items-center justify-end"}>
            <AiOutlineHeart />
            2.3K
          </div>
        </div>
      </div>
      <div>
        <img src={selectedNft?.image} />
      </div>
    </>
  )
}

export default NFTImage
