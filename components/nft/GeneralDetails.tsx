
import { AiFillHeart } from 'react-icons/ai';
import { MdRefresh } from 'react-icons/md';
import { RiShareBoxLine } from 'react-icons/ri';
import { FiMoreVertical } from 'react-icons/fi';
import { GiShare } from 'react-icons/gi';
import React from 'react';

const GeneralDetails = (props: any) => {
  const { selectedNft } = props;
  return (
    <div className={"flex"}>
      <div className={"h-36 flex flex-col flex-1 justify-between mb-6"}>
        <div className={"text-[#2081e2]"}>Bored Ape Yacht Club</div>
        <div className={"text-3xl font-extrabold"}>{selectedNft?.name}</div>
        <div className={"flex"}>
          <div className={"text-[#8a939b] mr-4"}>
            Owned by <span className={"text-[#2081e2]"}>e88vault</span>
          </div>
          <div className={"flex items-center text-[#8a939b]"}>
            <AiFillHeart className={"mr-1"} /> 2.3K favorites
          </div>
        </div>
      </div>
      <div className={"w-44"}>
        <div className={"flex container justify-between text-[1.4rem] border-2 rounded-lg"}>
          <ItemDetail icon={<MdRefresh />} />
          <ItemDetail icon={<RiShareBoxLine />} />
          <ItemDetail icon={<GiShare />} />
          <ItemDetail icon={<FiMoreVertical />} showDivider={false} />
        </div>
      </div>
    </div>
  )
}

const ItemDetail = (props: any) => {
  const { icon, showDivider = true } = props;
  return (
    <>
      <div className={"my-2"}>
        {icon}
      </div>
      {showDivider && <div className={"border-r-2"} />}
    </>
  )
}

export default GeneralDetails
