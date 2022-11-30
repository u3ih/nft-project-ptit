import ClientHome from "../components/home";
import React from "react";
import ClientMainLayout from "../components/layout/client-layout";

export default function Home() {
  return (
    <ClientHome />
  )
}

Home.layout = ClientMainLayout;

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}