import { Marketplace as MarketplaceContractType, UserID as UserContractType } from "contracts/src/types/contracts";
import * as t from "../types";

interface IStateProps {
  socket?: any;
  userAddress?: string;
  marketplaceContract?: any;
  userContract?: any;
  userInfo?: any;
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
        marketplaceContract: action.payload.marketplaceContract as MarketplaceContractType,
      };
    }
    case t.GET_MARKETPLACE_CONTRACT: {
      return {
        marketplaceContract: state?.marketplaceContract,
      };
    }
    case t.SET_USER_CONTRACT: {
      return {
        ...state,
        userContract: action.payload.userContract as UserContractType,
      };
    }
    case t.GET_USER_CONTRACT: {
      return {
        userContract: state?.userContract,
      };
    }
    case t.SET_USER_INFO: {
      return {
        ...state,
        userInfo: action.payload.userInfo as UserContractType,
      };
    }
    case t.GET_USER_INFO: {
      return {
        userInfo: state?.userInfo,
      };
    }
    case t.SET_USER_SOCKET: {
      return {
        ...state,
        socket: action.payload.socket,
      }
    }
    case t.GET_USER_SOCKET: {
      return {
        socket: state?.socket,
      }
    }
    default:
      return { ...state };
  }
}

export default main
