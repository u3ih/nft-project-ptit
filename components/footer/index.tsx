import React from "react";
import styles from "./footer.module.scss";
import Link from "next/link";
import {FacebookOutlined, InstagramOutlined, LinkedinOutlined} from "@ant-design/icons";

const Footer = () => {
    return (
        <footer className={styles["footer"]}>
            <div className={styles["waves"]}>
                <div className="wave" id="wave1"></div>
                <div className="wave" id="wave2"></div>
                <div className="wave" id="wave3"></div>
                <div className="wave" id="wave4"></div>
            </div>
            <ul className="social-icon">
                <li className="social-icon__item">
                    <a href="https://www.facebook.com/h.u3ih" target={"_blank"} rel="noreferrer">
                        <FacebookOutlined style={{fontSize: 24, color: "#ffffff"}}/>
                    </a>
                </li>
                <li className="social-icon__item">
                    <a href="https://www.linkedin.com/in/tran-hieu-69334322a" target={"_blank"} rel="noreferrer">
                        <LinkedinOutlined style={{fontSize: 24, color: "#ffffff"}}/>
                    </a>
                </li>
                <li className="social-icon__item">
                    <a href="https://www.instagram.com/u3ih.hi" target={"_blank"} rel="noreferrer">
                        <InstagramOutlined style={{fontSize: 24, color: "#ffffff"}}/>
                    </a>
                </li>
            </ul>
            <ul className="menu">
                <li className="menu__item">
                    <Link href="/">
                        <p className="menu__link">Home</p>
                    </Link>
                </li>
                <li className="menu__item">
                    <Link href="/my-nft">
                        <p className="menu__link">My Nfts</p>
                    </Link>
                </li>
                <li className="menu__item">
                    <Link href="/auction-nft">
                        <p className="menu__link">Auction Nfts</p>
                    </Link>
                </li>
                <li className="menu__item">
                    <Link href="/create-my-nft">
                        <p className="menu__link">Create Nft</p>
                    </Link>
                </li>
                <li className="menu__item">
                    <Link href="/user-info">
                        <p className="menu__link">My Info</p>
                    </Link>
                </li>
            </ul>
            <p className={"text-white"}>&copy;2022 Hiếu | All Rights Reserved</p>
        </footer>
    )
}

export default Footer;
