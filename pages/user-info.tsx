import UserInfoClient from "../components/user-info";
import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import Head from "next/head";

const UserInfoPage = () => {
  return (
      <>
        <Head>
          <title>My info</title>
          <meta property="og:title" content="My info" key="title" />
        </Head>
        <UserInfoClient />
      </>
  )
}
UserInfoPage.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default UserInfoPage;
