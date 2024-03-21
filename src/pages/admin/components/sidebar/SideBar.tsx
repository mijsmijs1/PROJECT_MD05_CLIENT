import './sidebar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { memberAction } from '@/stores/slices/member.slice';
import { Modal } from 'antd';

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <div className={sidebarOpen ? 'sidebar-responsive' : ''} id="sidebar">
            <div className='sidebar__title'>
                <div className='sidebar__img'>
                    <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cbf3c580-feca-46cf-8a3f-ceb136da5bb1/d39lpuk-d77fd28c-635b-4f63-ba7e-f953b94cbc0c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2NiZjNjNTgwLWZlY2EtNDZjZi04YTNmLWNlYjEzNmRhNWJiMVwvZDM5bHB1ay1kNzdmZDI4Yy02MzViLTRmNjMtYmE3ZS1mOTUzYjk0Y2JjMGMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.gfbHAmoImTwEGpCRgLOAQsSrWWYX0TU-wlDsmTS1Gt4" alt="logo" />

                </div>

                <i
                    onClick={() => closeSidebar()}
                    className="fa fa-times"
                    id="sidebarIcon"
                    aria-hidden="true"
                ></i>
            </div>

            <div className="sidebar__menu">
                <div className="sidebar__link active_menu_link"

                    onClick={() => {
                        navigate('/admin')
                    }}>
                    <i className="fa fa-minus-square"></i>
                    <span>Home</span>
                </div>

                <h2>ADMIN</h2>
                <div className="sidebar__link"
                    style={{ backgroundColor: window.location.href.includes('products') ? '#3ea175' : 'unset' }}
                    onClick={() => {
                        navigate('/admin/products?userId=all')
                    }}
                >
                    <i className="fa-solid fa-cubes"></i>
                    <span>Products Manager</span>
                </div>
                <div className="sidebar__link"
                    style={{ backgroundColor: window.location.href.includes('users') ? '#3ea175' : 'unset' }}
                    onClick={() => {
                        navigate('/admin/users')
                    }}>
                    <i className="fa-solid fa-users-gear"></i>
                    <span>Users</span>
                </div>
                <div className="sidebar__link"
                    style={{ backgroundColor: window.location.href.includes('categories') ? '#3ea175' : 'unset' }}
                    onClick={() => {
                        navigate('/admin/categories')
                    }}>
                    <i className="fa-solid fa-layer-group"></i>
                    <span>Categories</span>
                </div>
                <div className="sidebar__link"
                    style={{ backgroundColor: window.location.href.includes('branches') ? '#3ea175' : 'unset' }}
                    onClick={() => {
                        navigate('/admin/branches')
                    }}>
                    <i className="fa-solid fa-star-half-stroke"></i>
                    <span>Branches</span>
                </div>

                <h2>Statistical</h2>
                <div className="sidebar__link">
                    <i className="fa-solid fa-sack-dollar"></i>
                    <span>Revenue</span>
                </div>
                <div className="sidebar__link">
                    <i className="fa-solid fa-ranking-star"></i>
                    <span>Chart</span>
                </div>

                <div className="sidebar__logout"
                    onClick={() => {
                        Modal.confirm({
                            title: "Confirm",
                            content: "Are you sure you want to exit?",
                            onOk: () => {
                                localStorage.removeItem('tokenMember')
                                dispatch(memberAction.setData(null))
                                window.location.href = '/admin-authen'
                            },
                            onCancel: () => {

                            }
                        })

                    }}
                >
                    <i className="fa fa-power-off"></i>
                    <span>Log out</span>
                </div>
            </div>

        </div>
    )
}
export default Sidebar;