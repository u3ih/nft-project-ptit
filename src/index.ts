import { MyAppApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import Web3 from "web3";
import {marketplaceAddress} from "./common/constant";
import MarketplaceABI from "contracts/artifacts/contracts/Marketplace.sol/Marketplace.json";
const Provider = require('@truffle/hdwallet-provider');

export const DOMAIN_CHAIN_CONFIG = "http://127.0.0.1:7545"

export { MyAppApplication };

let app: any = null;

export const getApplication = () => {
  return app;
};

export const getMarketContract = () => {
  const provider = new Provider("9cad70dd6396b0f93b2b1bd82f3ae8abee7e3c5ea790b7f668b85c6e53b45afe", DOMAIN_CHAIN_CONFIG);
  const web3 = new Web3(provider);
  const myContract = new web3.eth.Contract(
      MarketplaceABI.abi as any,
      marketplaceAddress);
  return myContract
}

export async function main(options: ApplicationConfig = {}) {
  app = new MyAppApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
