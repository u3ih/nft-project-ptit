import UserInfoClient from "../components/user-info";
import React from "react";
import ClientMainLayout from "../components/layout/client-layout";

const UserInfoPage = () => {
  return (
    <UserInfoClient />
  )
}
UserInfoPage.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default UserInfoPage;
