import ClientHome from "../components/home";
import React, {useEffect} from "react";
import ClientMainLayout from "../components/layout/client-layout";
import {useLoadNftsFormContract} from "../src/hook/nft-hook";

const Home = () => {
  const loadNftsFormContract = useLoadNftsFormContract();
  useEffect(() => {
    const handlefetch = async () => {
      const a = await loadNftsFormContract();
      console.log("a: ", a);
    }
    handlefetch();
  }, [])
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
