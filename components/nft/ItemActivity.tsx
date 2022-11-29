import { CgArrowsExchangeV } from 'react-icons/cg';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { useState } from 'react';
import { dummyEvents } from '../../static/dummyEvents';
import EventItem from './itemActivity/EventItem';
import React from "react";
import style from "./nft.module.scss";

const ItemActivity = () => {
  const [toggle, setToggle] = useState(true)
  return (
    <div className={"w-full mt-8 border border-[#151b22] rounded-xl bg-[#303339] overflow-hidden"}>
      <div className={"bg-[#262b2f] px-6 py-4 flex items-center"} onClick={() => setToggle(!toggle)}>
        <div className={"flex-1 flex items-center text-xl font-bold"}>
          <span className={"text-3xl mr-2"}>
            <CgArrowsExchangeV />
          </span>
          Item Activity
        </div>
        <div className={style.titleRight}>
          {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
      </div>
      {toggle && (
        <div className={style.activityTable}>
          <div className={"flex items-center border border-[#151b22] mx-4 my-6 px-3 py-4 rounded-xl bg-[#363840]"}>
            <div className={"flex-1"}>Filter</div>
            <div className={"text-3xl mr-2"}>
              {' '}
              <AiOutlineDown />{' '}
            </div>
          </div>
          <div className={"flex w-full bg-[#262b2f] border-y border-[#151b22] mt-8 px-4 py-1"}>
            <div className={"text-[#2081e2] flex-[2]"}>Event</div>
            <div className={"text-[#2081e2] flex-[2]"}>Price</div>
            <div className={"text-[#2081e2] flex-[3]"}>From</div>
            <div className={"text-[#2081e2] flex-[3]"}>To</div>
            <div className={"text-[#2081e2] flex-[2]"}>Date</div>
          </div>
          {dummyEvents.map((event, id) => (
            <EventItem key={id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ItemActivity
