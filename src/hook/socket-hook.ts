import { io } from "socket.io-client";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import * as t from "../redux/types";

const createWebSocketConnection = () => {
    if (!global?.window) {
        return null;
    }
    const API_SERVER = process.env.NEXT_PUBLIC_API || location.origin;
    return new Promise((resolve, reject) => {
        const socket = io(`${API_SERVER}`, {
            extraHeaders: {
                token: Cookies.get("userToken") || "",
            },
        });

        socket.on("connect", () => {
            resolve(socket);
        });

        socket.on("connect_error", (error: any) => {
            console.log("socket error: ", error);
            reject(error);
        });
    });
}

export const useConnectSocket = () => {
    const dispatch = useDispatch();
    return async () => {
        const socket: any =  await createWebSocketConnection();
        dispatch({
            type: t.SET_USER_SOCKET,
            payload: {socket}
        });
    }
}

export const useGetSocket = () => {
    return useSelector(
        (state: any) => {
            const data = state.common.socket;
            return data;
        });
}
