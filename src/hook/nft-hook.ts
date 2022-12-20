import {ethers} from "ethers";
import {useGetMarketplaceContract, useGetUserAddress} from "./index";
import {doRequest} from "../common/do-request";

export const useCreateNft = () => {
    const userAddress = useGetUserAddress();
    const getMarketplaceContract = useGetMarketplaceContract();

    return async (newNft: any) => {
        const marketplaceContract = await getMarketplaceContract();
        if(!marketplaceContract) {
            return;
        }
        const {urlNFT, price} = newNft;
        const priceEther = ethers.utils.parseUnits(price, 'ether')
        let listingPrice = await marketplaceContract.methods.getListingPrice().call();
        listingPrice = listingPrice.toString();
        const result = await marketplaceContract.methods.createTokenSale(urlNFT, priceEther.toString()).send({ from: userAddress, value: listingPrice })
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
