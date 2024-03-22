import { useEffect, useState } from 'react'
import './admin.scss'
import { useDispatch, useSelector } from 'react-redux';
import { Socket, io } from 'socket.io-client';
import { Modal } from 'antd';
import { createContext } from 'react';
import { Store } from '@/stores';
import { memberAction } from '@/stores/slices/member.slice';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/SideBar';
import { Outlet } from 'react-router-dom';

export const SocketContext = createContext<null | Socket>(null);
export default function Home() {
    const dispatch = useDispatch();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [first, setFirst] = useState(false);
    const [contactConfirmState, setContactConfirmState] = useState(false);
    const memberStore = useSelector((store: Store) => store.memberStore);

    useEffect(() => {
        setSocket(io(`${import.meta.env.VITE_SOCKET_LOGIN_URL}`, {
            reconnectionDelayMax: 10000,
            auth: {
                tokenMember: String(localStorage.getItem("tokenMember"))
            }
        }))
    }, [])

    useEffect(() => {
        if (!localStorage.getItem("tokenMember")) {
            window.location.href = '/admin-authen'
        }
    }, [localStorage.getItem("tokenMember")])
    useEffect(() => {
        socket?.on('status', (res) => {

            if (!res.data) {
                if (res.invalidToken) {
                    localStorage.removeItem("tokenMember")
                    window.location.href = '/admin-authen'

                }
                Modal.error({
                    title: "Thông báo",
                    content: res.message
                })
            } else {
                dispatch(memberAction.setData(res.data))
            }
        })


        socket?.on('members', (data) => {
            dispatch(memberAction.setList(data))
        })

        socket?.on('online-list', (data) => {
            dispatch(memberAction.setOnlineList(data))
        })

        socket?.on("kick", (messageStr: string) => {
            Modal.confirm({
                title: "Thông báo",
                content: "Bạn bị logout bởi admin, reason: " + messageStr,
            })
            dispatch(memberAction.setData(null))
            localStorage.removeItem("tokenMember")
        });
    }, [socket])

    useEffect(() => {
        console.log(memberStore.data);

        if (memberStore.data?.firstLoginState) {
            setFirst(true);
        }
    }, [memberStore.data])

    useEffect(() => {
        if (!memberStore.data) return
        if (!memberStore.data?.emailConfirm) {
            setContactConfirmState(true);
        }
    }, [memberStore.data])

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar = () => {
        setSidebarOpen(true)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }
    return (
        <>
            <SocketContext.Provider value={socket}>
                {

                    (memberStore.data != null && !first && !contactConfirmState) && (
                        <div className="container">
                            <Navbar openSidebar={openSidebar} />
                            <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
                            <Outlet />
                        </div>
                    )
                }
                {/* {first && <FirstLogin />}
                {(contactConfirmState && !first) && <Verify />} */}
            </SocketContext.Provider>
        </>

    )
}