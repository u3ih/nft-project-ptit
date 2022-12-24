import classNames from "classnames";
import { Affix } from "antd";
import ClientMainFooter from "../footer";
import React from "react";
import Header from "../header";

export const ClientMainLayout = (props: any) => {
  const { children } = props;
  return (
    <div
      className={classNames("client-main-layout")}
    >
      <Affix>
        <Header />
      </Affix>
      <div className="client-main-layout-children-wrap">{children}</div>
       <ClientMainFooter />
    </div>
  );
};

export default ClientMainLayout;
