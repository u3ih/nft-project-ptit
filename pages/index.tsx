import ClientHome from "../components/home";
import React from "react";
import ClientMainLayout from "../components/layout/client-layout";

const Home = () => {

  return (
    <ClientHome />
  )
}

Home.Layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default Home;
