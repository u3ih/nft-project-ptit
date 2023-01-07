import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'
import React, {useEffect, useMemo, useState} from "react";
import {doRequest} from "../../src/common/do-request";
import {message} from "antd";
import {useGetUserData} from "../../src/hook";
import {HeartTwoTone} from "@ant-design/icons";

const NFTImage = (props: any) => {
  const { selectedNft } = props;
  const currentUser = useGetUserData();
  const {likes} = selectedNft ?? {};
  const [countLike, setCountLike] = useState(0);

  useEffect(() => {
      return setCountLike(likes?.length ?? 0);
  }, [likes])

    const handleLikeNft = async () => {
      const networkData = {
          url: `nfts/like/${selectedNft?.id}`
      }
      const res = await doRequest(networkData, "put");
      if(res?.error) {
          message.error(res?.error?.message);
      } else {
          message.success("Thành công");
          setCountLike(countLike + 1);
      }
    }
    const isLiked = useMemo(() => {
        return likes?.includes(currentUser?.id) || countLike > likes?.length;
    }, [likes, countLike, currentUser])

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
                <div className={"flex-1 flex items-center justify-end hover:cursor-pointer gap-[5px]"} onClick={handleLikeNft}>
                    <HeartTwoTone twoToneColor={isLiked ? "#eb2f96" : "#666666"} />
                    {countLike}
                </div>
            </div>
        </div>
    </div>
  )
}

export default NFTImage
