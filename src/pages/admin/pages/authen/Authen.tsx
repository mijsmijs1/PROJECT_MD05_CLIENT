import { useEffect, useState } from 'react'
import './authen.scss'

import { Modal } from 'antd';
import LoadingButton from '@/components/loadingButton/LoadingButton';
import { api } from '@/services/apis';


export default function Authen() {
    const [load, setLoad] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("tokenMember")) {
            window.location.href = '/admin'
        }
    }, [localStorage.getItem("tokenMember")])
    return (
        <div className="container">
            <div className="screen">

                <form className="form" onSubmit={async (e: React.FormEvent) => {
                    e.preventDefault();
                    try {
                        let data = {
                            loginId: (e.target as any).loginId.value,
                            password: (e.target as any).password.value
                        }
                        setLoad(true)
                        let res = await api.member.login(data);
                        setLoad(false)
                        localStorage.setItem("tokenMember", res.data.token);
                        Modal.success({
                            title: "Thông báo",
                            content: "Thành công xác thực, di chuyển tới trang quản trị!",
                            onOk: () => {
                                window.location.href = "/admin"
                            }
                        })
                    } catch (err: any) {
                        setLoad(false)
                        Modal.warning({
                            title: "Thông báo",
                            content: err?.response?.data?.message || "Lỗi không rõ!"
                        })
                    }
                }}>
                    <p className="form-title">Log in to ADMIN page</p>
                    <div className="input-container">
                        <input type="text" placeholder="Enter email or login ID" id="loginId" />
                        <span>
                        </span>
                    </div>
                    <div className="input-container">
                        <input type="password" placeholder="Enter password" id="password" />
                    </div>
                    <button
                        type="submit"
                        className="submit"
                        style={{
                            position: 'relative'
                        }}>
                        Sign in
                        {load && <LoadingButton></LoadingButton>}
                    </button>
                </form>
            </div>
        </div>
    )
}
