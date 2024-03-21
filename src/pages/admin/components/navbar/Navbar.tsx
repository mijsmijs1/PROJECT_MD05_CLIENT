import { useSelector } from 'react-redux';
import './Navbar.scss'
import { Store } from '@/stores';


const Navbar = ({ sidebarOpen, openSidebar }) => {
    const memberStore = useSelector((store: Store) => store.memberStore);
    return (
        <div className="navbar">
            <div className="nav_icon" onClick={() => openSidebar()}>
                <i className="fa fa-bars" aria-hidden="true"></i>
            </div>

            <div className="navbar__left">
                <a href="">Nhân sự</a>
                <a href="">Thống kê</a>
                <a href="" className="active_link">Admin</a>
            </div>

            <div className="navbar__right">
                <a href="">
                    <i className="fa fa-search"></i>
                </a>

                <a href="">
                    <i className="fa-solid fa-clock"></i>
                </a>

                <a href="">
                    <img width="30" src={memberStore.data.avatar} alt="avatar" />
                </a>
            </div>
        </div>
    )
}

export default Navbar