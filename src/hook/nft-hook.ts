import {ethers} from "ethers";
import {useGetMarketplaceContract, useGetUserAddress, useGetUserData} from "./index";
import {doRequest} from "../common/do-request";
import {DOMAIN_CHAIN_CONFIG} from "./helpers";
import {marketplaceAddress} from "../common/constant";
import axios from "axios";
import {useRouter} from "next/router";
import Marketplace from 'contracts/artifacts/contracts/Marketplace.sol/Marketplace.json'
import {message, notification} from "antd";

export const useCreateNft = () => {
    const userAddress = useGetUserAddress();
    const getMarketplaceContract = useGetMarketplaceContract();

    return async (newNft: any) => {
        const marketplaceContract = await getMarketplaceContract();
        if(!marketplaceContract) {
            return;
        }
        const {tokenURI, price, isAuction, minJumpPrice, timeEndAuction} = newNft;
        const priceEther = ethers.utils.parseUnits(price, 'ether')
        let listingPrice = await marketplaceContract.methods.getListingPrice().call();
        listingPrice = listingPrice.toString();
        let result;
        console.log("newNft: ", newNft);
        if(!isAuction) {
            result = await marketplaceContract.methods.createTokenSale(tokenURI, priceEther.toString()).send({ from: userAddress, value: listingPrice })
        } else {
            const minPrice = ethers.utils.parseUnits(minJumpPrice.toString(), 'ether');
            console.log("minJumpPrice, timeEndAuction: ", minJumpPrice, timeEndAuction);
            result = await marketplaceContract.methods.createTokenAuction(tokenURI, priceEther.toString(), minPrice, timeEndAuction.unix()).send({ from: userAddress, value: listingPrice })
        }
        const returnFromContractValue = result?.events?.Approval?.returnValues;
        const marketItem = result?.events?.Approval || {};
        delete marketItem.returnValues;
        const networkdata = {
            url: "nfts",
            body: {
                ...newNft,
                ...marketItem,
                ...returnFromContractValue,
                id: undefined,
            }
        }
        await doRequest(networkdata, "post")
    }
}

export const useLoadNftsFromContract = () => {
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
                ...i,
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
            url: `/nfts/list-nft-auction?filter[where][userId]=${userInfo?.id}`,
        }
        const itemsMyAuction = await doRequest(networkMyAuction) || [];
        const networkMyBuyingAuction = {
            url: `/nfts/list-nft-auction?filter[where][buyerId]=${userInfo?.id}`,
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
                ...i,
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
    const userInfo = useGetUserData();
    const { push } = useRouter();
    const getMarketplaceContract = useGetMarketplaceContract();
    return async (nft: { price: any, tokenId: string, id: string }) => {
        const marketplaceContract = await getMarketplaceContract();
        if (!nft || !userInfo || !marketplaceContract) {
            return;
        }
        /* user will be prompted to pay the asking proces to complete the transaction */
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        await marketplaceContract.methods.createMarketSale(nft.tokenId).send({ from: userInfo?.userAddress, value: price as any })
        const requestNftInfo = {
            url: `nfts/${nft?.id}`,
            body: {
                sold: true,
                owner: userInfo?.userAddress,
                userId: userInfo?.id
            }
        }
        await doRequest(requestNftInfo, "put")
        push("/my-nft");
    }
}

export const useResellNft = () => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const userInfo = useGetUserData();
    const { push } = useRouter();
    const getMarketplaceContract = useGetMarketplaceContract();

    return async (nft:{price?: string, id: any, tokenId: any}) => {
        const marketplaceContract = await getMarketplaceContract();
        if (!nft.price || !nft.id || !nft.tokenId || !userInfo || !marketplaceContract) {
            return;
        }
        /* user will be prompted to pay the asking proces to complete the transaction */
        const priceFormatted = ethers.utils.parseUnits(nft.price, 'ether')
        let listingPrice = await marketplaceContract.methods.getListingPrice().call();

        listingPrice = listingPrice.toString()
        await marketplaceContract.methods.resellToken(nft.tokenId.toString(), priceFormatted.toString()).send({ from: userInfo?.userAddress, value: listingPrice })
        const requestNftInfo = {
            url: `nfts/${nft?.id}`,
            body: {
                price: nft.price,
                sold: false,
                owner: userInfo?.userAddress,
                userId: userInfo?.id
            }
        }
        await doRequest(requestNftInfo, "put")
        message.success("Thành công")
        push("my-nft");
    }
}

export const useAuctionNft = () => {
    const userInfo = useGetUserData();
    const getMarketplaceContract = useGetMarketplaceContract();
    const {reload} = useRouter();
    return async (nft: { auctionPrice: any, tokenId: string, id: string }) => {
        const marketplaceContract = await getMarketplaceContract();
        if (!nft || !userInfo || !marketplaceContract) {
            return;
        }
        /* user will be prompted to pay the asking proces to complete the transaction */
        const auctionPrice = ethers.utils.parseUnits(nft.auctionPrice.toString(), 'ether')
        try {
        await marketplaceContract.methods.updateAuctionPrice(nft.tokenId, auctionPrice).send({ from: userInfo?.userAddress, value: auctionPrice as any })
        const requestNftInfo = {
            url: `nfts/${nft?.id}`,
            body: {
                buyer: userInfo?.userAddress,
                price: nft.auctionPrice,
                buyerId: userInfo?.id,
            }
        }
        await doRequest(requestNftInfo, "put");
        await reload();
        } catch (e: any) {
            notification.error({message: e?.message})
        }
    }
}

export const useEndAuctionNft = () => {
    const userInfo = useGetUserData();
    const getMarketplaceContract = useGetMarketplaceContract();
    const {reload} = useRouter();
    return async (nft: { auctionPrice: any, tokenId: string, id: string }) => {
        const marketplaceContract = await getMarketplaceContract();
        if (!nft || !userInfo || !marketplaceContract) {
            return;
        }
        try {
            await marketplaceContract.methods.endAuctionSection(nft.tokenId).send({ from: userInfo?.userAddress })
            const requestNftInfo = {
                url: `nfts/${nft?.id}`,
                body: {
                    userId: userInfo?.id,
                    owner: userInfo?.userAddress,
                    sold: true,
                    isAuction: false,
                }
            }
            await doRequest(requestNftInfo, "put");
            await reload();
        } catch (e: any) {
            notification.error({message: e?.message})
        }
    }
}
