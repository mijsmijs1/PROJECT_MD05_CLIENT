import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { convertToVND } from '@mieuteacher/meomeojs';
import { api } from '@/services/apis';


export default function SortByPrice({ activeProducts, keyword }) {
    const navigate = useNavigate()
    const [product, setProduct] = useState([])
    function formatTimeAgo(dateString) {
        const date: any = new Date(dateString);
        const now: any = new Date();
        const diff = Math.floor((now - date) / 1000); // Độ chênh lệch thời gian tính bằng giây

        if (diff < 60) {
            return `${diff} giây trước`;
        } else if (diff < 60 * 60) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} phút trước`;
        } else if (diff < 60 * 60 * 24) {
            const hours = Math.floor(diff / (60 * 60));
            return `${hours} giờ trước`;
        } else if (diff < 60 * 60 * 24 * 7) {
            const days = Math.floor(diff / (60 * 60 * 24));
            return `${days} ngày trước`;
        } else if (diff < 60 * 60 * 24 * 30) {
            const weeks = Math.floor(diff / (60 * 60 * 24 * 7));
            return `${weeks} tuần trước`;
        } else {
            const months = Math.floor(diff / (60 * 60 * 24 * 30));
            return `${months} tháng trước`;
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const onPageChange = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        const fetchData = async () => {
            let count = await api.product.getProductTotal()
            setTotalPages(Math.ceil(count.data.data.count / 18))
        }
        fetchData()
    }, [])
    useEffect(() => {

        const fetchData = async () => {
            try {
                if (currentPage) {
                    console.log('currentPage', currentPage);

                    const res = await api.product.getProductSearchFull(keyword, currentPage, sortBy ? sortBy : "none");
                    if (res.status == 200) {
                        console.log(res);

                        setProduct((Object.values(res.data.data)))
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [currentPage])
    const range = (start, end) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const renderPageNumbers = () => {
        //Tổng page số là 6
        const maxPagesToShow = 6;
        //Lấy mốc tính là 3
        const sidePages = Math.floor(maxPagesToShow / 2);
        // chọn max giữa 1 và (số page hiện tại - 3) => hiển thị 3 số phía sau của page đang hiển thị
        //Mấy trang đầu sẽ ra âm => tính là 1
        const startPage = Math.max(1, currentPage - sidePages);
        //CHọn min giữa tổng page và (page đã lùi 3 + trang hiện tại -1) => VD: start page =2 thì end =7 (tổng 6)
        //Mấy trang cuối sẽ lớn hơn total
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        //tạo arr rổng
        let pages = [];
        if (startPage > 1) {
            //Nếu vượt start page > 1 thì sẽ gắn cụm ... vào đầu tiên
            pages = pages.concat([1, '...']);
        }

        pages = pages.concat(range(startPage, endPage));
        //Gắn cụm từ start đến end có 6 phần tử vào giữa
        if (endPage < totalPages) {
            //nếu bé hơn total => đang khúc giữa, => gắn thêm ...
            pages = pages.concat(['...', totalPages]);
        }
        return pages.map((page, index) => (
            <span
                key={index}
                className={`page-number ${page === currentPage ? 'current' : ''}`}
                onClick={() => {
                    onPageChange(page)

                }}
            >
                {page}
            </span>
        ));
    };
    return (
        <>
            <div className='all_item'>
                {product
                    ?.map((item) => {
                        // if (renderCount >= 18) {
                        //     return null; // Dừng việc render nếu đã đạt đến giới hạn
                        // }
                        // setRenderCount(renderCount + 1)
                        return <>
                            <div className="container_item"
                                onClick={() => {
                                    navigate(`product-info?productId=${item.id}`)
                                }}>
                                {item.priorityStatus == "active" && <div className='priority_logo'>
                                    <img src="https://www.ganemo.co/web/image/product.template/513/image_1024?unique=eaa03e2" alt="" />
                                    <span>ĐỐI TÁC</span>
                                </div>}

                                <div className="img_container">
                                    <img src={`${import.meta.env.VITE_SV_HOST}/${item.avatar}`} />
                                </div>
                                <div className="content_container">
                                    {item.priorityStatus == "active" && <span className='priority_logo_vip'>
                                        <i className="fa-regular fa-circle-up"></i>
                                        <span>UY TÍN</span>
                                    </span>}
                                    <h6>{JSON.parse(item.detail).title}</h6>
                                    <p>{item.branchId == 1 && `${JSON.parse(item.detail).area} m²`}</p>
                                    <h5>{convertToVND(item.price)}</h5>
                                    <div className='info'>
                                        <img src='https://static.chotot.com/storage/chotot-icons/svg/user.svg'></img>
                                        <span>{formatTimeAgo(Number(item.createAt))}</span><span> - </span><span>{item.address.split("&&")[4].replace(/Thành phố|Tỉnh/g, "")}</span>
                                    </div>

                                </div>
                            </div>
                        </>
                    })
                }
            </div>
            <div className="pagination">
                <span onClick={() => {
                    onPageChange(currentPage - 1)
                }}>&lt;</span>
                {renderPageNumbers()}
                <span onClick={() => {
                    onPageChange(currentPage + 1)
                }}>&gt;</span>
            </div>
        </>
    )

}
