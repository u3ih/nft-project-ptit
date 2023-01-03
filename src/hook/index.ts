import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import * as t from "../../src/redux/types";
import Cookies from "js-cookie";
import {  NFT_STORAGE_KEY } from "./helpers";
import { NFTStorage } from "nft.storage";
import {marketplaceAddress, userContractAddress} from "../common/constant";
import { message } from "antd";
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

export const useIsAdmin = () => {
    const userInfo = useGetUserData();
    return userInfo?.role?.includes("ADMIN");
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
