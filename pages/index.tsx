import ClientHome from "../components/home";
import React from "react";
import ClientMainLayout from "../components/layout/client-layout";
import Head from 'next/head'

const Home = () => {

  return (
      <>
        <Head>
            <title>u3ih market</title>
            <meta property="og:title" content="u3ih market" key="title" />
        </Head>
        <ClientHome />
      </>
  )
}

Home.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default Home;
