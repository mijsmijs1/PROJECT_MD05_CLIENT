import { store } from "@/stores";
import { chatAction } from "@/stores/slices/chat.slice";
import { Socket, io } from "socket.io-client";

enum ChatType {
    TEXT = "TEXT",
    IMG = "IMG",
    VIDEO = "VIDEO",
    LINK = "LINK"
}
export interface Chat {
    id: number;
    userId: number;
    memberId: number;
    content: string;
    type: ChatType;
    createAt: string;
}
class SocketChat {
    socket: Socket;
    constructor(

    ) { }
    async connectChat(): Promise<{
        status: boolean,
        message: string[]
    } | null> {
        return await new Promise((resolve) => {
            this.socket = io(`${import.meta.env.VITE_SOCKET_LOGIN_URL}?tokenChat=${localStorage.getItem('token')}`)
            this.socket.on('chat-history', (data: Chat[]) => {
                store.dispatch(chatAction.setData(data))
            })

            setTimeout(() => {
                if (!this.socket.connected) {
                    this.disconnectChat()
                    resolve(null)
                }
            }, 1000)
        })
    }
    disconnectChat() {
        if (!this.socket) {
            return
        }
        this.socket.disconnect();
        this.socket = null;
    }
    sendMessage(userId: number, content: string) {
        this.socket.emit('user-chat', {
            userId,
            content
        })
    }
}
export let socketChat = new SocketChat()