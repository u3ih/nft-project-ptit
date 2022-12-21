import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import * as t from "../../src/redux/types";
import Cookies from "js-cookie";
import { DOMAIN_CHAIN_CONFIG, NFT_STORAGE_KEY } from "./helpers";
import { NFTStorage } from "nft.storage";
import { ethers } from "ethers";
import {marketplaceAddress, userContractAddress} from "../common/constant";
import Marketplace from 'contracts/artifacts/contracts/Marketplace.sol/Marketplace.json'
import axios from "axios";
import { Marketplace as MarketplaceContractType, UserID as UserContractType } from "contracts/src/types/contracts";
import { message } from "antd";
import { useRouter } from "next/router";
import MarketplaceABI from "contracts/artifacts/contracts/Marketplace.sol/Marketplace.json";
import UserABI from "contracts/artifacts/contracts/UserID.sol/UserID.json";
import {doRequest} from "../common/do-request";

declare let window: any

export const useGetWeb3 = () => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    const setInfoAddress = useSetInfoAddress();

    return async () => {
        if (window.ethereum) {
            try {
                const web3 = new Web3(window.ethereum);
                // Request account access if needed
                const userAddress = await window.ethereum.enable();
                setInfoAddress(userAddress[0]);
                // Acccounts now exposed
                return web3;
            } catch (error) {
                console.error(error);
            }
        } else {
            message.error("Please download MetaMask extension");
        }
        // Legacy dapp browsers...
        // else if (window.web3) {
        //     // Use Mist/MetaMask's provider.
        //     const web3 = window.web3;
        //     console.log("Injected web3 detected.", window.web3);
        //     return web3;
        // }
        // Fallback to localhost; use dev console port by default...
        // else {
        //     const provider = new Web3.providers.HttpProvider(DOMAIN_CHAIN_CONFIG);
        //     const web3 = new Web3(provider);
        //     console.log("No web3 instance injected, using Local web3.");
        //     return web3;
        // }
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
    const getWeb3 = useGetWeb3();

    return () => {
        let marketplaceContract;
        const connect = async () => {

            const web3 = await getWeb3();
            if (!web3) {
                return null;
            }
            marketplaceContract = await new web3.eth.Contract(
                MarketplaceABI.abi as any,
                marketplaceAddress
            );
            return marketplaceContract;
        }
        return connect();
    }
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
                tokenId: Number(i.tokenId),
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

export const useLoadMyNfts = () => {
    const userAddress = useGetUserAddress();
    return async () => {
        if(!userAddress) {
            return;
        }
        const networkSelling = {
            url: "nfts/me-selling",
        }
        const itemsSelling = await doRequest(networkSelling) || [];
        const networkBought = {
            url: "nfts/me-bought",
        }
        const itemsBought = await doRequest(networkBought) || [];
        return {itemsSelling, itemsBought};
    }
}

export const useLoadAuctionNfts = () => {
    const userInfo = useGetUserData();
    return async () => {
        if(!userInfo) {
            return;
        }
        const networkMarketAuction = {
            url: "/nfts/list-nft-auction",
        }
        const itemsAuction = await doRequest(networkMarketAuction) || [];
        const networkMyAuction = {
            url: `/nfts/list-nft-auction?filter[where][buyerId]=${userInfo?.id}`,
        }
        const itemsMyAuction = await doRequest(networkMyAuction) || [];
        const networkMyBuyingAuction = {
            url: `/nfts/list-my-nft-auction`,
        }
        const itemsMyBuyingAuction = await doRequest(networkMyBuyingAuction) || [];
        return {itemsAuction, itemsMyAuction, itemsMyBuyingAuction};
    }
}

export const useLoadMyNftsFormContract = () => {
    const getMarketplaceContract = useGetMarketplaceContract();
    const userAddress = useGetUserAddress();
    return async () => {
        const marketplaceContract = await getMarketplaceContract();
        if(!marketplaceContract) {
            return;
        }
        const data = await marketplaceContract.methods.fetchMyNFTs().call({ from: userAddress });
        const items = await Promise.all(data.map(async (i: any) => {
            const tokenURI = await marketplaceContract.methods.tokenURI(i.tokenId).call()
            const meta = await axios.get(tokenURI)
            const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            const item = {
                price,
                tokenId: Number(i.tokenId),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                tokenURI
            }
            return item
        })) || []
        return items;
    }
}

export const useBuyNft = () => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const userAddress = useGetUserAddress();
    const { push } = useRouter();
    const getMarketplaceContract = useGetMarketplaceContract();
    return async (nft: { price: any, tokenId: string, id: string }) => {
        const marketplaceContract = await getMarketplaceContract();
        if (!nft || !userAddress || !marketplaceContract) {
            return;
        }
        /* user will be prompted to pay the asking proces to complete the transaction */
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        await marketplaceContract.methods.createMarketSale(nft.tokenId).send({ from: userAddress, value: price as any })
        const requestNftInfo = {
            url: `nfts/${nft?.id}`,
            body: {
                sold: true,
                owner: userAddress
            }
        }
        await doRequest(requestNftInfo, "put")
        push("/my-nft");
    }
}

export const useSetUserContract = () => {
    const dispatch = useDispatch();
    return (userContract: any) => {
        dispatch({
            type: t.SET_USER_CONTRACT,
            payload: userContract
        });
        Cookies.set("userContract", userContract);
    }

}

export const useGetUserContract = () => {
    const getWeb3 = useGetWeb3();
    return async () => {
        const web3 = await getWeb3();
        if (!web3) {
            return;
        }
        const userContract = new web3.eth.Contract(
            UserABI.abi as any,
            userContractAddress
        );
        return userContract;
    }
}

export const useSetUserData = () => {
    const dispatch = useDispatch();
    return (userInfo: string) => {
        dispatch({
            type: t.SET_USER_INFO,
            payload: userInfo
        });
        Cookies.set("userInfo", JSON.stringify(userInfo));
    }
}

export const useGetUserData = () => {
    const userInfo = Cookies.get("userInfo") || "{}";
    return useSelector(
        (state: any) => {
            const data = state.common.userInfo || userInfo;
            const result = JSON.parse(data);
            return result;
        });
}

export const useHandleFetchUserDataByAddress = () => {
    const setUserInfo = useSetUserData();
    return async (userAddress: string) => {
        const networkdata = {
            url: "users/find-or-create",
            body: {
                userAddress
            }
        }
        const userLogin = await doRequest(networkdata, "post");
        Cookies.set("userToken", userLogin?.access_token);
        setUserInfo(userLogin);
    }
}
