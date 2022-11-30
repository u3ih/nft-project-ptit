import Image from "next/image";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import style from "./header.module.scss";
import React from "react";
import UserDropdown from "./user-dropdown";

const Header = () => {
  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <Image src={"/assets/images/opensea.png"} height={40} width={40} />
          <div className={style.logoText}>Hiếu market</div>
        </div>
      </Link>
      <div className={style.headerItems}>
        <Link href="/collections/0x66a576A977b7Bccf510630E0aA5e450EC11361Fa">
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