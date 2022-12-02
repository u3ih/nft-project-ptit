import Image from "next/image";
import Link from "next/link";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import style from "./header.module.scss";
import React from "react";
import UserDropdown from "./user-dropdown";
import { useGetUserAddress, useGetWeb3 } from "../../src/hook";
import cls from "classnames";
import { Button, message } from "antd";
import { useDispatch } from "react-redux";
import * as t from "../../src/redux/types";
import MarketplaceABI from "contracts/artifacts/contracts/Marketplace.sol/Marketplace.json";
import { marketplaceAddress } from "../../src/common/constant";

const Header = () => {
  const userAddress = useGetUserAddress();
  const getWeb3 = useGetWeb3();
  const dispatch = useDispatch();
  const handleClickConnectWallet = async () => {
    const web3 = await getWeb3();
    if (!web3) {
      return;
    }
    dispatch({
      type: t.SET_MARKETPLACE_CONTRACT,
      payload: {
        marketplaceContract: new web3.eth.Contract(
          MarketplaceABI.abi as any,
          marketplaceAddress
        ),
      },
    });
  }
  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <Image src={"/assets/images/opensea.png"} height={40} width={40} />
          <div className={style.logoText}>Hiếu market</div>
        </div>
      </Link>
      <div className={cls(style.headerItem, "flex items-center")}>
        {userAddress ? (
          <span className="text-[12px]">Hello {userAddress}</span>
        ) : (
          <Button {...{
            onClick: handleClickConnectWallet,
            className: "text-white"
          }}>
            Connect metamask
          </Button>
        )}
      </div>
      <div className={style.headerItems}>
        <Link href="/my-nft">
          <div className={style.headerItem}> Collections </div>
        </Link>
        <div className={style.headerItem}> Stats </div>
        <div className={style.headerItem}> Resources </div>
        <div className={style.headerItem}>
          <Link href="/create-my-nft">Create </Link>
        </div>
        <div className={style.headerIcon}>
          <UserDropdown />
        </div>
        <div className={style.headerIcon}>
          <MdOutlineAccountBalanceWallet color={"white"} />
        </div>
      </div>
    </div>
  )
}

export default Header;