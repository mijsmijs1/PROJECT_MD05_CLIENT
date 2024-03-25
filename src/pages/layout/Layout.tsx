import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import './layout.scss'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';
import Login from '@/components/login/Login';
import { Modal } from 'antd';
import img from '../../../public/img/technologies.png'
export default function Layout() {
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        Modal.info({
            title: "Welcome to Nguy Phu Quy's website!",
            content: (
                <div style={{ width: '700px', height: '600px' }}>
                    <p>Some information about my website.</p>
                    <img src={img} alt="Description of image" style={{ maxWidth: '100%', height: 'auto' }} />
                    <p>Facebook: facebook.com/phuquy119</p>
                    <p>Zalo: 0936549721</p>
                    <p>Github Client: https://github.com/mijsmijs1/PROJECT_MD05_CLIENT</p>
                    <p>Github Server: https://github.com/mijsmijs1/PROJECT_MD05_SERVER</p>
                </div>
            ),
            width: '42%',
            onOk: () => {
                // Thêm xử lý khi nhấn nút "OK" ở đây nếu cần
            }
        });
    }, [])
    return (
        <div className='layout_container'>

            <div className='nav_container'>
                <Navbar setModalVisible={setModalVisible} />
            </div>
            {modalVisible && <Login setModalVisible={setModalVisible} />}
            <div className='body_container'>
                <Outlet />
            </div>
            <div className='footer_container'>
                <Footer />
            </div>
        </div>
    )
}
