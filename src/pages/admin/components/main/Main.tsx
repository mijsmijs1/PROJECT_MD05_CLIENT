import "./main.scss";
import logo from '../../../../../public/img/logo_chotroi.png';
import { useEffect, useState } from "react";
import { api } from "@/services/apis";
import { convertToVND } from '@mieuteacher/meomeojs';

const Main = () => {
    const [activeProductCount, setActiveProductCount] = useState(0);;
    const [doneProductCount, setDoneProductCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.product.getStatusCount(-1);
                if (res.status === 200) {
                    setActiveProductCount(res.data.data.activeProductCount);
                    setDoneProductCount(res.data.data.doneProductCount)
                }
                const result = await api.wallet.getTotalRevenue()
                if (result.status == 200) {
                    setTotalRevenue(result.data.data.amount)
                }
                const data = await api.user.getUserCount()
                console.log(data);

                if (data.status == 200) {
                    setTotalUser(data.data.data.userCount)
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();

    }, [])
    return (
        <main>
            <div className="main__container">{/* === Container === */}

                <div className="main__title">{/* === Title === */}
                    <img src={logo} alt="hello" />
                    <div className="main_greeting">
                        <h1>Trang quản trị</h1>
                    </div>
                </div>

                <div className="main__cards">
                    <div className="card">{/* === CARDS === */}
                        <i className="fa-solid fa-tags"></i>
                        <div className="card_inner">
                            <p className="text-primary-p">Số sản phẩm đang rao bán</p>
                            <span className="font-bold text-title">{activeProductCount}</span>
                        </div>
                    </div>

                    <div className="card">{/* === CARDS === */}
                        <i className="fa fa-money-bill fa-2x text-red"></i>
                        <div className="card_inner">
                            <p className="text-primary-p">Doanh thu của trang web</p>
                            <span className="font-bold text-title">{convertToVND(totalRevenue)}</span>
                        </div>
                    </div>

                    <div className="card">{/* === CARDS === */}
                        <i className="fa-solid fa-user-tie fa-2x text-yellow"></i>
                        <div className="card_inner">
                            <p className="text-primary-p">Số tài khoản đăng kí</p>
                            <span className="font-bold text-title">{totalUser}</span>
                        </div>
                    </div>

                    <div className="card">{/* === CARDS === */}
                        <i className="fa-regular fa-calendar-check fa-2x text-green"></i>
                        <div className="card_inner">
                            <p className="text-primary-p">Tổng sản phẩm đã rao xong</p>
                            <span className="font-bold text-title">{doneProductCount}</span>
                        </div>
                    </div>
                </div>

                <div className="charts">{/* === CHARTS ==== */}

                    <div className="charts__right">{/* === PHẢI === */}
                        <div className="charts__right__title">
                            <div>
                                <h1>Báo cáo hàng ngày</h1>
                                <p>Ngụy Phú Quý</p>
                            </div>
                            <i className="fa fa-area-chart"></i>
                        </div>

                        <div className="charts__right__cards">
                            <div className="card1">
                                <h1>Lợi nhuận</h1>
                                <p>R$2.500</p>
                            </div>

                            <div className="card2">
                                <h1>Thanh toán</h1>
                                <p>R$250,00</p>
                            </div>

                            <div className="card3">
                                <h1>Chi phí </h1>
                                <p>R$150,00</p>
                            </div>

                            <div className="card4">
                                <h1>Cơ sở dữ liệu</h1>
                                <p>R$180,00</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}

export default Main;