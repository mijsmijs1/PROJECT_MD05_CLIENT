import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import './layout.scss'
import { Outlet } from 'react-router-dom'
import { useState } from 'react';
import Login from '@/components/login/Login';

export default function Layout() {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <div className='layout_container'>
            <div className='nav_container'>
                <Navbar setModalVisible={setModalVisible}/>
            </div>
            {modalVisible && <Login setModalVisible={setModalVisible}/>}
            <div className='body_container'>
                <Outlet />
            </div>
            <div className='footer_container'>
                <Footer />
            </div>
        </div>
    )
}
