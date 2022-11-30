import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import * as t from "../../src/redux/types";
import Cookies from "js-cookie";
import { DOMAIN_CHAIN_CONFIG, NFT_STORAGE_KEY } from "./helpers";
import { NFTStorage } from "nft.storage";
import { ethers } from "ethers";
import { marketplaceAddress } from "../common/constant";
import Marketplace from 'contracts/artifacts/contracts/Marketplace.sol/Marketplace.json'
import axios from "axios";
import { MarketplaceContractType } from "contracts/src/types/contracts";

declare let window: any

export const useGetWeb3 = () => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            window.ethereum.enable();
            // Acccounts now exposed
            return web3;
        } catch (error) {
            console.error(error);
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.", window.web3);
        return web3;
    }
    // Fallback to localhost; use dev console port by default...
    else {
        const provider = new Web3.providers.HttpProvider(DOMAIN_CHAIN_CONFIG);
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        return web3;
    }
};

export const useSetInfoAddress = () => {
    const dispatch = useDispatch();
    return (userAddress: string) => {
        dispatch({
            type: t.SET_ADDRESS,
            payload: userAddress
        });
        Cookies.set("userAddress", userAddress);
    }

}

export const useGetUserAddress = () => {
    const address = Cookies.get("userAddress") || "";
    return useSelector(
        (state: any) => {
            return state.common.userAddress || address;
        });
}

export const useSetMarketplaceContract = () => {
    const dispatch = useDispatch();
    return (marketplaceContract: any) => {
        dispatch({
            type: t.SET_MARKETPLACE_CONTRACT,
            payload: marketplaceContract
        });
        Cookies.set("marketplaceContract", marketplaceContract);
    }

}

export const useGetMarketplaceContract = () => {
    const marketplaceContract = Cookies.get("marketplaceContract") || "";
    return useSelector(
        (state: any) => {
            return state.common.marketplaceContract || marketplaceContract;
        });
}

export const useGetNFTStorage = () => {
    const nftStorage = new NFTStorage({ token: NFT_STORAGE_KEY });
    return nftStorage;
}

export const useLoadNfts = () => {
    const provider = new ethers.providers.JsonRpcProvider(DOMAIN_CHAIN_CONFIG)
    const contract = new ethers.Contract(marketplaceAddress, Marketplace.abi, provider)
    return async () => {
        const data = await contract.fetchMarketItems()
        /*
        *  map over items returned from smart contract and format 
        *  them as well as fetch their token metadata
        */
        const items = await Promise.all(data.map(async (i: any) => {
            const tokenUri = await contract.tokenURI(i.tokenId)
            let meta;
            try {
                meta = await axios.get(tokenUri)
            } catch {
                return null;
            }
            const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            const item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item
        })) || []
        return items;
    }
}

export const useBuyNft = () => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const { userAddress } = useGetUserAddress();
    const marketplaceContract: MarketplaceContractType = useGetMarketplaceContract();
    return async (nft: any) => {
        if (!nft || !userAddress) {
            return;
        }
        /* user will be prompted to pay the asking proces to complete the transaction */
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        await marketplaceContract.methods.createMarketSale(nft.tokenId).send({ value: price as any })
    }
}