import style from "./header.module.scss";
import {Badge, Divider, Drawer, List, Skeleton} from "antd";
import React, {useEffect, useState} from "react";
import {BellOutlined} from "@ant-design/icons";
import {doRequest} from "../../src/common/do-request";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import dayjs from "dayjs";

const NotificationDrawer = () => {
    const [openNotification, setOpenNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const showDrawer = () => {
        setOpenNotification(true);
    }
    useEffect(() => {
        const handleFetchNoti = async () => {
            const netWorkdata = {
                url: "notifications/me"
            }
            const notifications = await doRequest(netWorkdata)
            setNotifications(notifications);
        }
        handleFetchNoti();
    }, [])

    const loadMoreData = () => {
        return;
    }
    return (
        <div className={style.headerIcon}>
            <Drawer
                title="Notification"
                placement={"right"}
                closable={false}
                onClose={() => setOpenNotification(false)}
                open={openNotification}
            >
                <InfiniteScroll
                    dataLength={notifications.length}
                    next={loadMoreData}
                    hasMore={false}
                    loader={<Skeleton paragraph={{ rows: 1 }} active />}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={notifications}
                        renderItem={(item: any) => (
                            <List.Item>
                                <div className={"flex gap-[5px] flex-col items-end w-full"}>
                                    <div className={"flex gap-[5px] items-center self-start"}>
                                        <img {...{
                                            src: item?.fileUrl,
                                            className: "w-[40px] h-[40px]",
                                            alt: item?.nftName
                                        }}/>
                                        {item?.type === "buy_nft" ? (
                                            <p>{item?.nftName} đã được bán với giá
                                                <p>{item?.price} ETH</p>
                                            </p>
                                        ) : (
                                            <p>{item?.nftName} vừa được đấu giá
                                                <p>{item?.price} ETH</p>
                                            </p>
                                        )}
                                    </div>
                                    <p className={"text-[13px] text-[#666666]"}>{dayjs(item?.createAt).format("DD/MM/YYYY hh:mm:ss")}</p>
                                </div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </Drawer>
            <Badge count={notifications?.length ?? 0} overflowCount={9} size={"small"} >
                <BellOutlined style={{color: "white", fontSize: 20}} onClick={showDrawer} />
            </Badge>
        </div>
    )
}

export default NotificationDrawer;
