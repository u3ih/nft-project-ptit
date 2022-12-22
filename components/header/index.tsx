import Image from "next/image";
import Link from "next/link";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import style from "./header.module.scss";
import React, {useEffect, useState} from "react";
import UserDropdown from "./user-dropdown";
import {useGetUserAddress, useGetUserData, useGetWeb3} from "../../src/hook";
import cls from "classnames";
import {Button, Drawer, message} from "antd";
import {useRouter} from "next/router";

const Header = () => {
  const getWeb3 = useGetWeb3();
  const userInfo = useGetUserData();
  const [web3, setWeb3] = useState<any>();
  const [myBalance, setMyBalance] = useState<string>();
  const {push} = useRouter();

  const handleClickConnectWallet = async () => {
    const web3 = await getWeb3();
    setWeb3(web3);
  }
  const [open, setOpen] = useState(false);

  const showDrawer = async () => {
    const web3 = await getWeb3();
    setWeb3(web3);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if(!web3) {
      return;
    }
    web3.eth.getBalance(userInfo?.userAddress, (err: Error, balance: string) => {
      const myBalance = web3.utils.fromWei(balance, "ether") + " ETH";
      setMyBalance(myBalance);
    });
  }, [web3])

  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <Image src={"/assets/images/opensea.png"} height={40} width={40} alt={"img"}/>
          <div className={style.logoText}>Hiếu market</div>
        </div>
      </Link>
      <div className={cls(style.headerItem, "flex items-center")}>
        {!userInfo?.id ? (
          <Button {...{
            onClick: handleClickConnectWallet,
            className: "text-white",
            type: "primary"
          }}>
            Connect metamask
          </Button>
        ) : (
            <Button {...{
              onClick: async () => {
                await push("/")
                await handleClickConnectWallet();
              },
              className: "text-white",
              type: "primary"
            }}>
              Sync metamask
            </Button>
        )}
      </div>
      <div className={style.headerItems}>
        <Link href="/my-nft">
          <div className={style.headerItem}> My Nfts </div>
        </Link>
        <Link href="/auction-nft">
          <div className={style.headerItem}> Auction Nfts </div>
        </Link>
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
            <p className={"mb-[5px] font-bold text-[16px]"}>Số dư hiện tại của bạn là:</p>
            <p>{myBalance}</p>
          </Drawer>
          <MdOutlineAccountBalanceWallet color={"white"} onClick={showDrawer}/>
        </div>
      </div>
    </div>
  )
}

export default Header;
