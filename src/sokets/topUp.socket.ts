import { store } from "@/stores";
import { authenAction } from "@/stores/slices/authen.slice";
import { Socket, io } from "socket.io-client";

class topUpSocketClass {
    socket: Socket;
    constructor() { }
    async connectTopUp(): Promise<{
        status: boolean,
        message: string[]
    } | null> {
        return await new Promise((resolve) => {
            this.socket = io(`${import.meta.env.VITE_SOCKET_LOGIN_URL}`, {
                reconnectionDelayMax: 10000,
                auth: {
                    tokenTopUp: String(localStorage.getItem("token"))
                }
            })
            this.socket?.on("state", (res) => {
                console.log('res',res)    
                if (!res.data) {
                    resolve({
                        status: false,
                        message: [res.message]
                    })
                } else {
                    store.dispatch(authenAction.setData(res.data))
                }

            })
            setTimeout(() => {
                if (!this.socket.connected) {
                    this.disconnectTopUp()
                    resolve(null)
                }
            }, 1000)
        })
    }
    disconnectTopUp() {
        if (!this.socket) {
            return
        }
        this.socket?.disconnect();
        this.socket = null;
    }
    async topUp() {
        console.log("da vao socket 2");
        return await new Promise((resolve) => {
            console.log("da vao socket 1");
            this.socket?.on("topUp", (res) => {
                console.log("da vao socket");
                
                if (res.data) {
                    store.dispatch(authenAction.setData(res.data))
                    localStorage.setItem('token', res.tokenCode)
                    resolve({
                        ...res
                    })
                }

            })
        })

    }

}
export let topUpSocket = new topUpSocketClass();