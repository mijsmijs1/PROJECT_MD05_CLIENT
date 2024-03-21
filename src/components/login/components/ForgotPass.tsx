
import { api } from '@/services/apis';
import { Modal } from 'antd';
import { useState } from 'react';
export default function ForgotPass({ setDisplayForgotPass }: {
    setDisplayForgotPass: any
}) {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            // Gọi hàm forgotPassword với giá trị email


            let result = await api.authen.forgotPassword({ email: email });
            if (result.status == 200) {
                Modal.success({
                    title: "Thành công",
                    content: result.data.message,
                    onOk: () => {
                        setDisplayForgotPass(false)
                    }
                })
            }
            // Xử lý sau khi gọi hàm thành công
        } catch (error) {

            console.log(error);

            // Xử lý lỗi nếu có
            Modal.error({
                title: "Thất bại",
                content: error.response?.data.message || "System err!",
                onOk: () => {

                }
            })
        }
    };
    return (
        <div className='forgot_password'>
            <h4>Lấy lại mật khẩu</h4>
            <p onClick={() => {
                setDisplayForgotPass(false)
            }}>✕</p>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
            />
            <button onClick={() => { handleForgotPassword() }}>Nhận mật khẩu qua email</button>
        </div>
    )
}
