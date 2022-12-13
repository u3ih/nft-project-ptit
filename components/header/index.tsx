import Image from "next/image";
import Link from "next/link";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import style from "./header.module.scss";
import React, {useState} from "react";
import UserDropdown from "./user-dropdown";
import {useGetUserAddress, useGetUserData, useGetWeb3} from "../../src/hook";
import cls from "classnames";
import {Button, Drawer, message} from "antd";
import { useDispatch } from "react-redux";
import * as t from "../../src/redux/types";
import MarketplaceABI from "contracts/artifacts/contracts/Marketplace.sol/Marketplace.json";
import { marketplaceAddress } from "../../src/common/constant";

const Header = () => {
  const getWeb3 = useGetWeb3();
  const userInfo = useGetUserData();
  const handleClickConnectWallet = async () => {
    await getWeb3();
  }
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <Image src={"/assets/images/opensea.png"} height={40} width={40} />
          <div className={style.logoText}>Hiếu market</div>
        </div>
      </Link>
      <div className={cls(style.headerItem, "flex items-center")}>
        {!userInfo?.id && (
          <Button {...{
            onClick: handleClickConnectWallet,
            className: "text-white",
            type: "primary"
          }}>
            Connect metamask
          </Button>
        )}
      </div>
      <div className={style.headerItems}>
        <Link href="/my-nft">
          <div className={style.headerItem}> My Nfts </div>
        </Link>
        <div className={style.headerItem}> Auction Nfts </div>
        <div className={style.headerItem}> Resources </div>
        <div className={style.headerItem}>
          <Link href="/create-my-nft">Create Nft</Link>
        </div>
        <div className={style.headerIcon}>
          <UserDropdown />
        </div>
        <div className={style.headerIcon}>
          <Drawer
              title="Wallet Drawer"
              placement={"right"}
              closable={false}
              onClose={onClose}
              open={open}
          >
            <p>Số dư của bạn là</p>
            <p>10000000000000 VND</p>
          </Drawer>
          <MdOutlineAccountBalanceWallet color={"white"} onClick={showDrawer}/>
        </div>
      </div>
    </div>
  )
}

export default Header;
