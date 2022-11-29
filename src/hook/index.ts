import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import * as t from "../../src/redux/types";
import Cookies from "js-cookie";

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
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
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
    }

}

export const useGetMarketplaceContract = () => {
    const marketplaceContract = Cookies.get("marketplaceContract") || "";
    return useSelector(
        (state: any) => {
            return state.common.marketplaceContract || marketplaceContract;
        });
}