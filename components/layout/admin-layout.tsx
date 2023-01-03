import classNames from "classnames";
import React, {useState} from "react";
import Header from "../header";
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {Affix} from "antd/lib";
import AdminPage from "../admin";
import Image from "next/image";

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('User management', 'user-management', <PieChartOutlined />),
    getItem('NFT management', 'nft-management', <DesktopOutlined />),
    getItem('Statistic', 'transaction-management', <FileOutlined />),
];

export const AdminLayout = (props: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('user-management');
    const onClick: MenuProps['onClick'] = e => {
        setCurrent(e.key);
    };
    return (
        <div
            className={classNames("client-main-layout")}
        >
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className={"h-[32px] my-[12px] mx-auto flex items-center justify-center"}>
                    <Image src={"/assets/images/opensea.png"} height={40} width={40} alt={"img"}/>
                </div>
                <Menu theme="dark" defaultSelectedKeys={[current]} mode="inline" items={items} onClick={onClick}/>
            </Sider>
            <Layout className="site-layout">
                <Affix>
                    <Header isHiddenLogo/>
                </Affix>
                <Content style={{ margin: '0 16px' }}>
                    <div className="client-main-layout-children-wrap">
                        <AdminPage current={current}/>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Hiếu market ©2022</Footer>
            </Layout>
        </Layout>
        </div>
    );
};

export default AdminLayout;
