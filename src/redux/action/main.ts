import * as t from "../types";

export const setInfoUser = (userAddress: any) => (dispatch: any) => {
  dispatch({ type: t.SET_ADDRESS, payload: userAddress })
}

export const getInfoUser = () => (dispatch: any) => {
  dispatch({ type: t.GET_ADDRESS })
}

export const setMarketplaceContact = (marketplaceContract: any) => (dispatch: any) => {
  dispatch({ type: t.SET_MARKETPLACE_CONTRACT, payload: marketplaceContract })
}

export const getMarketplaceContact = () => (dispatch: any) => {
  dispatch({ type: t.GET_MARKETPLACE_CONTRACT })
}

export const setUserContact = (marketplaceContract: any) => (dispatch: any) => {
  dispatch({ type: t.SET_USER_CONTRACT, payload: marketplaceContract })
}

export const getUserContact = () => (dispatch: any) => {
  dispatch({ type: t.GET_USER_CONTRACT })
}

export const setUserInfo = (userInfo: any) => (dispatch: any) => {
  dispatch({ type: t.SET_USER_INFO, payload: userInfo })
}

export const getGetUserInfo = () => (dispatch: any) => {
  dispatch({ type: t.GET_USER_INFO })
}
