import style from "./hero.module.scss";
import React from "react";
import {Col, Row} from "antd";
import cls from "classnames";
import {useRouter} from "next/router";

const Hero = () => {
  const {push} = useRouter();
  const handleClickCreateNft = () => {
    push("/create-my-nft")
  }
  return (
    <div className={cls("wrapper", style["wrapper"])}>
      <Row gutter={[{xs: 12, sm: 12, md: 24}, {xs: 12, sm: 12, md: 24}]}>
        <Col {...{xs: 24, sm: 24, md: 16}}>
          <div className={style.contentWrapper}>
            <div className={style.copyContainer}>
              <div className={style.title}>
                Discover, collect, and sell extraordinary NFTs
              </div>
              <div className={style.description}>
                OpenSea is the world&apos;s first and largest NFT marketplace
              </div>
              <div className={style.ctaContainer}>
                <button className={style.button} onClick={handleClickCreateNft}>
                  <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Create</span>
                </button>
              </div>
            </div>
          </div>
        </Col>
        <Col {...{xs: 24, sm: 24, md: 8}}>
          <div className={style.cardContainer}>
            <img
                className="rounded-t-lg rounded-[10px]"
                src="/assets/images/hero-banner.webp"
                alt=""
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Hero;
