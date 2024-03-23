// Import React and CSS file if needed
import { useState } from 'react';
import './login.scss';
import { Modal } from 'antd';
import { api } from '@/services/apis';
import { loginWithGoogle } from '@/services/firebase';
import LoadingButton from '../loadingButton/LoadingButton';
import ForgotPass from './components/ForgotPass';

const Login = ({ setModalVisible }: { setModalVisible: any }) => {
    const [isSignup, setIsSignup] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [load, setLoad] = useState(false)
    const [displayForgotPass, setDisplayForgotPass] = useState(false)
    const handleLoginClick = () => {
        setIsLogin(!isLogin);
        setIsSignup(!isSignup);
    };

    const handleSignupClick = () => {
        setIsSignup(!isSignup);
        setIsLogin(!isLogin);
    };
    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        try {
            const userName = (e.target as any).userName.value;
            const email = (e.target as any).email.value;
            const password = (e.target as any).password.value;

            if (!userName || !email || !password) {
                alert("Vui lòng nhập đầy đủ các trường");
                return;
            }
            const newUser = {
                userName,
                email,
                password
            }
            setLoad(true)
            let res = await api.authen.create(newUser);
            setLoad(false)
            if (res.status == 200) {
                Modal.success({
                    title: "Đăng kí thành công",
                    content: "Vui lòng kiểm tra email của bạn để xác thực",
                    onOk: () => {
                        (e.target as any).userName.value = "";
                        (e.target as any).email.value = "";
                        (e.target as any).password.value = "";
                        handleLoginClick()
                    }
                })
            }
        } catch (err: any) {
            console.log(err);
            setLoad(false)
            Modal.error({
                title: "Lỗi",
                content: err.response?.data?.message.join(" ") || "Lỗi không rõ!"
            })
        }
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!(e.target as any).loginInfo.value || !(e.target as any).loginPassword.value) {
                Modal.warning({
                    title: "Chú ý!",
                    content: "Vui lòng nhập đầy đủ thông tin đăng nhập!",
                    onOk: () => { }
                })
                return
            }


            let loginData = {
                loginInfo: (e.target as any).loginInfo.value,
                password: (e.target as any).loginPassword.value

            }
            setLoad(true)
            let result = await api.authen.login(loginData)
            if (result.status == 200) {
                (e.target as any).loginInfo.value = "";
                (e.target as any).loginPassword.value = "";
                setLoad(false)
                localStorage.setItem("token", result.data.data)
                Modal.success({
                    title: result.data.message,
                    onOk: () => {
                        window.location.href = "/"
                    }
                })
            }
        } catch (err: any) {
            console.log(err);

            setLoad(false)
            Modal.error({
                title: "Lỗi!",
                content: err.response?.data?.message,
                onOk: () => {

                }
            });

        }
    }
    const closeModal = () => {
        setModalVisible(false);
    };
    async function handleLoginWithSosial(result: any, name: string) {
        try {
            setLoad(true)
            let data = {
                googleToken: result?.user?.accessToken,
                user: {
                    email: result.user.email,
                    avatar: result.user.photoURL,
                    userName: String(Math.ceil(Date.now() * Math.random())),
                    password: String(Math.ceil(Date.now() * Math.random()))
                }
            }
            let resultApi = await api.authen.loginWithGoogle(data);
            if (resultApi.status == 200) {
                localStorage.setItem("token", resultApi.data.token)
                setLoad(false)
                Modal.success({
                    title: "Notication",
                    content: `Đăng nhập với ${name} thành công!`,
                    onOk: () => {
                        window.location.href = "/"
                    }
                })
            }
        } catch (err: any) {
            console.log('err', err);
            setLoad(false)
            Modal.error({
                title: 'Error',
                content: err.response ? err.response.data.message : "Loi khong xac dinh"
            })
        }
    }
    return (
        <div>
            <div className='login_container'>
                {
                    displayForgotPass && <ForgotPass setDisplayForgotPass={setDisplayForgotPass} />
                }
                {isSignup &&
                    <div className="form-container">
                        <button onClick={() => {
                            closeModal()
                        }} className='button-exit'>X</button>
                        <div className="logo-container">

                            <img src='../../../img/signUp.png'></img>

                        </div>
                        <div className="social-buttons">
                            <button className="social-button google"
                                onClick={async () => {
                                    setLoad(true)
                                    let result = await loginWithGoogle();
                                    // reauthenticate();
                                    handleLoginWithSosial(result, "Google")
                                }}
                            >
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth={0}
                                    version="1.1"
                                    x="0px"
                                    y="0px"
                                    className="google-icon"
                                    viewBox="0 0 48 48"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="#FFC107"
                                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                    />
                                    <path
                                        fill="#FF3D00"
                                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                    />
                                    <path
                                        fill="#4CAF50"
                                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                    />
                                    <path
                                        fill="#1976D2"
                                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                    />
                                </svg>


                                <span>Sign in with Google</span>
                                {load && <LoadingButton />}
                            </button>
                            <button className="social-button apple">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    className="w-5 h-5 fill-current"
                                >
                                    <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                                </svg>

                                <span>Sign in with Github</span>
                            </button>
                        </div>
                        <div className="line" />
                        <form className="form"
                            onSubmit={(e) => { handleSignup(e) }}
                        >
                            <div className="form-group"
                                style={{ marginBottom: 0 }}
                            >
                                <label htmlFor="userName"><i className="fa-regular fa-user input-icon"></i>Login ID</label>
                                <input
                                    required
                                    placeholder="Enter your login ID"
                                    name="userName"
                                    type="text"
                                />
                            </div>
                            <div className="form-group"
                                style={{ marginBottom: 0 }}
                            >
                                <label htmlFor="email">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 500 500"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z" />
                                    </svg>
                                    Email</label>
                                <input
                                    required
                                    placeholder="Enter your email"
                                    name="email"
                                    id="email"
                                    type="text"
                                />
                            </div>
                            <div className="form-group"
                                style={{ marginBottom: 0 }}
                            >
                                <label htmlFor="password">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 500 500"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z" />
                                    </svg>
                                    Password</label>
                                <input
                                    required
                                    name="password"
                                    placeholder="Enter your password"
                                    id="password"
                                    type="password"
                                />
                            </div>
                            <button type="submit" className="submit_btn">
                                Sign In {load && <LoadingButton />}
                            </button>
                        </form>
                        <p className="signup-link">
                            Already have an account?
                            <a className="signup-link link" href="" onClick={() => { handleLoginClick() }}>
                                {" "}
                                Log in now
                            </a>
                        </p>
                    </div>

                }
                {isLogin &&
                    <div className="form-container">
                        <button onClick={() => {
                            closeModal()
                        }} className='button-exit'>X</button>
                        <div className="logo-container">
                            <img src='../../../img/signIn.png'></img>
                        </div>
                        <div className="social-buttons">
                            <button className="social-button google"
                                onClick={async () => {
                                    setLoad(true)
                                    let result = await loginWithGoogle();
                                    // reauthenticate();
                                    handleLoginWithSosial(result, "Google")
                                }}
                            >
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth={0}
                                    version="1.1"
                                    x="0px"
                                    y="0px"
                                    className="google-icon"
                                    viewBox="0 0 48 48"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="#FFC107"
                                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                    />
                                    <path
                                        fill="#FF3D00"
                                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                    />
                                    <path
                                        fill="#4CAF50"
                                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                    />
                                    <path
                                        fill="#1976D2"
                                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                    />
                                </svg>

                                <span>Sign in with Google</span>
                                {load && <LoadingButton />}
                            </button>
                            <button className="social-button apple">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    className="w-5 h-5 fill-current"
                                >
                                    <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                                </svg>
                                <span>Sign in with Github</span>
                            </button>
                        </div>
                        <div className="line" />
                        <form className="form"
                            onSubmit={(e) => {
                                handleLogin(e)
                            }}
                        >
                            <div className="form-group">

                                <label htmlFor="userName&email">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 500 500"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z" />
                                    </svg>
                                    Login ID or Email
                                </label>


                                <input
                                    required
                                    placeholder="Enter your login ID or email"
                                    name="loginInfo"
                                    type="text"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">
                                    <svg
                                        className="input-icon"
                                        viewBox="0 0 500 500"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z" />
                                    </svg>

                                    Password
                                </label>
                                <input
                                    required
                                    name="loginPassword"
                                    placeholder="Enter your password"
                                    type="password"
                                />
                            </div>
                            <button type="submit" className="submit_btn">
                                Log In {load && <LoadingButton />}
                            </button>
                        </form>
                        <span className="forgot-password-link link"
                            onClick={() => {
                                setDisplayForgotPass(true)
                            }}
                        >
                            Forgot Password
                        </span>
                        <p className="signup-link">
                            Don't have an account?
                            <span className="signup-link link" href="" onClick={() => { handleSignupClick() }}>
                                {" "}
                                Create an account
                            </span>
                        </p>
                    </div>
                }

            </div >
        </div >

    );
};

export default Login;
