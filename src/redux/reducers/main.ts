import { Marketplace } from "contracts/src/types/contracts";
import * as t from "../types";

interface IStateProps {
  userAddress?: string;
  marketplaceContract?: any;
}

const main = (state: IStateProps, action: any) => {
  switch (action.type) {
    case t.SET_ADDRESS:
      return {
        ...state,
        userAddress: action.payload
      };
    case t.GET_ADDRESS:
      return {
        userAddress: state?.userAddress,
      }
    case t.SET_MARKETPLACE_CONTRACT: {
      return {
        ...state,
        marketplaceContract: action.payload.marketplaceContract as Marketplace,
      };
    }
    case t.GET_MARKETPLACE_CONTRACT: {
      return {
        marketplaceContract: state?.marketplaceContract,
      };
    }
    default:
      return { ...state };
  }
}

export default main