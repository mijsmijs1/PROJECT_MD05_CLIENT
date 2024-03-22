import { api } from '@/services/apis';
import { Store } from '@/stores';
import { authenAction } from '@/stores/slices/authen.slice';
import { Modal } from 'antd';
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function UserInfo({ setShowUserInfo }: {
    setShowUserInfo: any
}) {
    const dispatch = useDispatch();
    const authenStore = useSelector((store: Store) => store.authenStore)
    const [displayChangePass, setDisplayChangePass] = useState(false);
    const [displayChangeEmail, setDisplayChangeEmail] = useState(false);
    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const oldEmailRef = useRef<HTMLInputElement>(null);
    const newEmailRef = useRef<HTMLInputElement>(null);
    const confirmNewPasswordRef = useRef<HTMLInputElement>(null);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((e.target as any).userName.value == authenStore.data.userName &&
            (e.target as any).phoneNumber.value == authenStore.data.phoneNumber &&
            (e.target as any).firstName.value == authenStore.data.firstName &&
            (e.target as any).lastName.value == authenStore.data.lastName &&
            (e.target as any).birthday.value == authenStore.data.birthday) {
            Modal.error({
                title: "Lỗi!",
                content: "Nothing change!",
                onOk: () => {

                }
            });
            return
        }
        const birthdayValue = new Date((e.target as any).birthday.value).getTime();
        let userInfo = {
            userName: (e.target as any).userName.value,
            phoneNumber: (e.target as any).phoneNumber.value,
            firstName: (e.target as any).firstName.value,
            lastName: (e.target as any).lastName.value,
            birthday: String(birthdayValue)
        }
        let result = await api.user.update(authenStore.data.id, { ...userInfo })
        if (result.status == 200) {
            dispatch(authenAction.setData(result.data.data));
            localStorage.setItem('token', result.data.token)
            Modal.success({
                title: "Thành công!",
                content: result.data.message,
                onOk: () => {
                    window.location.href = `/user_info?user=${authenStore.data?.id}`
                },
                onCancel: () => {
                }
            })
        }
    };
    const handleChangePass = async () => {
        const oldPassword = oldPasswordRef.current?.value;
        const newPassword = newPasswordRef.current?.value;
        const confirmNewPassword = confirmNewPasswordRef.current?.value;
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            Modal.error({
                title: "Lỗi!",
                content: "Vui lòng nhập đầy đủ các trường để đổi mật khẩu!",
                onOk: () => {

                }
            });
            return
        }
        if (newPassword != confirmNewPassword) {
            Modal.error({
                title: "Lỗi!",
                content: "Mật khẩu mới không trùng khớp!",
                onOk: () => {

                }
            });
            return
        }
        if (displayChangePass) {
            try {
                let result = await api.user.changePass(authenStore.data.id, { oldPassword: oldPassword, newPassword: newPassword })
                if (result.status == 200) {
                    dispatch(authenAction.setData(result.data.data));
                    localStorage.setItem('token', result.data.token)
                    Modal.success({
                        title: "Thành công!",
                        content: result.data.message,
                        onOk: () => {
                            window.location.href = `/user_info?user=${authenStore.data?.id}`
                        },
                        onCancel: () => {
                        }
                    })

                }
            } catch (err) {
                console.log(err);

                Modal.error({
                    title: "Lỗi!",
                    content: err.response?.data?.message.join(" ") || "Lỗi không rõ!",
                    onOk: () => {

                    }
                });
                return
            }

        }

    }
    const handleChangeEmail = async () => {
        const oldEmail = oldEmailRef.current?.value;
        const newEmail = newEmailRef.current?.value;
        if (!oldEmail || !newEmail) {
            Modal.error({
                title: "Lỗi!",
                content: "Vui lòng nhập đầy đủ các trường để đổi email!",
                onOk: () => {

                }
            });
            return
        }
        if (displayChangeEmail) {
            try {
                let result = await api.user.changeEmail(authenStore.data.id, { oldEmail: oldEmail, newEmail: newEmail })
                if (result.status == 200) {
                    Modal.success({
                        title: "Thành công!",
                        content: result.data.message,
                        onOk: () => {
                            window.location.href = `/user_info?user=${authenStore.data?.id}`
                        },
                        onCancel: () => {
                        }
                    })

                }
            } catch (err) {
                console.log(err);

                Modal.error({
                    title: "Lỗi!",
                    content: err.response?.data?.message.join(" ") || "Lỗi không rõ!",
                    onOk: () => {

                    }
                });
                return
            }

        }

    }
    function maskEmail(email) {
        // Tách phần tên người dùng và tên miền
        const [username, domain] = email.split('@');
        // Lấy hai ký tự đầu tiên của phần tên người dùng
        const maskedUsername = username.substring(0, 2);
        // Tạo chuỗi '**********' có cùng độ dài với phần còn lại của phần tên người dùng
        const maskedChars = '*'.repeat(username.length - 2);
        // Ghép lại phần tên người dùng và tên miền
        const maskedEmail = maskedUsername + maskedChars + '@' + domain;
        return maskedEmail;
    }
    return (
        <div className='product_describe_form'>
            <div className='info_container'>
                <p onClick={() => {
                    setShowUserInfo(false)
                }}>✕</p>
                <h2>User Information</h2>
                <form onSubmit={(e) => { handleSubmit(e) }} className="user-form">

                    <div className="form-group">
                        <label htmlFor="userName">Username:</label>
                        <input type="text" name="userName" id="userName" defaultValue={authenStore.data.userName} placeholder="Username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" id="password" defaultValue="**********" placeholder="Password" disabled />
                        <button className='change_btn' onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định của nút
                            setDisplayChangePass(!displayChangePass)
                        }}>Đổi mật khẩu</button>
                        {
                            displayChangePass && <div className='mini_input'>
                                <label htmlFor="oldPassword">Old Password:</label>
                                <input ref={oldPasswordRef} type="password" id="oldPassword" placeholder="Old Password" required />

                                <label htmlFor="newPassword">New Password:</label>
                                <input ref={newPasswordRef} type="password" id="newPassword" placeholder="New Password" required />

                                <label htmlFor="ConfirmNewPassword">Confirm New Password:</label>
                                <input ref={confirmNewPasswordRef} type="password" id="ConfirmNewPassword" placeholder="Confirm New Password" required />
                                <button onClick={(e) => {
                                    if (displayChangePass) {
                                        e.preventDefault(); // Ngăn chặn hành vi mặc định của nút
                                        handleChangePass()
                                    }
                                }}>Xác nhận thay đổi mật khẩu</button>
                            </div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" id="email" defaultValue={maskEmail(authenStore.data.email)} placeholder="Email" disabled />
                        <button className='change_btn' onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định của nút
                            setDisplayChangeEmail(!displayChangeEmail)
                        }}>Đổi email</button>
                        {
                            displayChangeEmail && <>
                                <div className='mini_input'>
                                    <label htmlFor="oldEmail">Old Email:</label>
                                    <input ref={oldEmailRef} type="email" id="oldEmail" placeholder="Old Email" required />
                                    <label htmlFor="newEmail">New Email:</label>
                                    <input ref={newEmailRef} type="email" id="newEmail" placeholder="New Email" required />
                                    <button onClick={(e) => {
                                        e.preventDefault(); // Ngăn chặn hành vi mặc định của nút
                                        handleChangeEmail()

                                    }}>Xác nhận thay đổi email</button>
                                </div>
                            </>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input type="text" name="phoneNumber" id="phoneNumber" defaultValue={authenStore.data.phoneNumber ? authenStore.data.phoneNumber : ""} placeholder="Phone Number" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" name="firstName" id="firstName" defaultValue={authenStore.data.firstName ? authenStore.data.firstName : ""} placeholder="First Name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" name="lastName" id="lastName" defaultValue={authenStore.data.lastName ? authenStore.data.lastName : ""} placeholder="Last Name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthday">Birthday:</label>
                        <input
                            type="date"
                            name="birthday"
                            id="birthday"
                            defaultValue={authenStore.data.birthday ? new Date(parseInt(authenStore.data.birthday)).toISOString().substring(0, 10) : ""}
                            placeholder="Birthday"
                            required
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>

            </div>

        </div>
    )
}
