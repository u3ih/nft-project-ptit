import { BsFillCartFill } from 'react-icons/bs';
import React from "react";

const EventItem = (props: any) => {
  const { event } = props;
  return (
    <div className={"flex px-4 py-5 font-medium"}>
      <div className={"flex items-center flex-[2]"}>
        <div className={"mr-2 text-xl"}>
          <BsFillCartFill />
        </div>
        <div className={"text-lg font-semibold"}>Sale</div>
      </div>
      <div className={"flex items-center flex-[2]"}>
        <img
          src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
          alt="eth"
          className={"h-5 mr-2"}
        />
        <div className={"text-lg"}>{event.price}</div>
      </div>
      <div className={"text-[#2081e2] flex-[3]"}>{event.from}</div>
      <div className={"text-[#2081e2] flex-[3]"}>{event.to}</div>
      <div className={"text-[#2081e2] flex-[2]"}>{event.date}</div>
    </div>
  )
}

export default EventItem
