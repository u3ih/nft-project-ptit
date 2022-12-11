import Cookies from "js-cookie";

export interface INetwork extends RequestInit {
    url: string | any;
    params?: object | any;
    options?: object | any;
    body?: object | any;
}

export const doRequest = async (
    networkData: INetwork,
    method?: "get" | "post" | "put" | "delete" | "patch" | "options",
) => {
    const token = Cookies.get("userToken");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${networkData?.url}`, {
        method: (method || "GET").toUpperCase(),
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',
        headers: {
            ...networkData.headers,
            Authorization: `Bearer ${token}`,
            Accept:  "application/json",
            "Content-Type": "application/json; charset=utf-8",
        },
        body: method === "get" ? undefined : JSON.stringify(networkData?.body),
    });
    if (response?.status === 204 || response?.statusText === "No Content") {
        return {
            success: true,
            statusText: "No Content",
            isNoContent: true,
        };
    }
    return response.json();
};
