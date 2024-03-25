import { useEffect, useState } from 'react'
import './search.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { convertToVND } from '@mieuteacher/meomeojs';
import locationData from "../../../location.json"
import { api } from '@/services/apis';
export default function Search() {
    const navigate = useNavigate()
    const [activeProducts, setActiveProducts] = useState([])
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

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const branch = searchParams.get('branch');
    const keyword = searchParams.get('keyword');
    const sortBy = searchParams.get('sortBy');
    const address = searchParams.get('address');
    const page = Number(searchParams.get('page'));
    const [currentPage, setCurrentPage] = useState(page);
    const [totalPages, setTotalPages] = useState(0);
    const [cities, setCities] = useState([]);
    useEffect(() => {
        setCities(locationData);
    }, [])
    const onPageChange = (page) => {
        setCurrentPage(page);
    };
    if (category && !branch && !keyword) {
        useEffect(() => {
            const fetchData = async () => {
                try {
                    if (currentPage) {
                        const res = await api.product.getProducCategory(category, currentPage, sortBy ? sortBy : "none", address ? address : "none");
                        if (res.status == 200) {
                            setActiveProducts((Object.values(res.data.data.products)))
                            setTotalPages(Math.ceil(res.data.data.totalNumber / 15))
                        }
                    }

                } catch (err) {
                    console.log(err);
                }
            }
            fetchData();
        }, [currentPage, category, branch, sortBy, address])

    }
    if (category && branch && !keyword) {
        useEffect(() => {
            const fetchData = async () => {
                try {
                    if (currentPage) {
                        const res = await api.product.getProducBranch(branch, currentPage, sortBy ? sortBy : "none", address ? address : "none");
                        if (res.status == 200) {
                            setActiveProducts((Object.values(res.data.data.products)))
                            setTotalPages(Math.ceil(res.data.data.totalNumber / 15))
                        }
                    }

                } catch (err) {
                    console.log(err);
                }
            }
            fetchData();
        }, [currentPage, category, branch, sortBy, address])
    }
    if (category && keyword) {
        useEffect(() => {
            const fetchData = async () => {
                try {
                    if (currentPage) {
                        const res = await api.product.getProductSearchFull(keyword, currentPage, sortBy ? sortBy : "none", category, address ? address : "none");
                        if (res.status == 200) {
                            console.log(res);

                            setActiveProducts((Object.values(res.data.data.products)))
                            setTotalPages(Math.ceil(res.data.data.totalNumber / 15))
                        }
                    }

                } catch (err) {
                    console.log(err);
                }
            }
            fetchData();
        }, [currentPage, sortBy, keyword, address])
    }

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
                    navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '').replace(/(page=)[^\&]+/, `$1${page}`)}`)
                }}
            >
                {page}
            </span>
        ));
    };

    return (
        <div className='search_box'>
            <div className='search_app'>
                <div className='search_top'>
                    {keyword && <span><i className="fa-solid fa-magnifying-glass"></i> Kết quả tìm kiếm của '{keyword}'</span>}
                    {(category && !branch && !keyword) && <span><i className="fa-solid fa-filter"></i> Danh mục sản phẩm '{category}'</span>}
                    {branch && <span><i className="fa-solid fa-filter"></i> Danh mục sản phẩm '{branch}'</span>}
                </div>
                <div className='sort'>
                    <span>Sắp xếp theo </span>
                    <button
                        style={{ backgroundColor: sortBy == 'time' ? "#49CC90" : "white", border: sortBy == 'time' ? "none" : "1px solid black", color: sortBy == 'time' ? "white" : "black" }}
                        onClick={() => {
                            if (!window.location.href.includes('sortBy')) {
                                navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '')}&&sortBy=time`)
                            } else {
                                navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '').replace(/(sortBy=)[^\&]+/, `$1time`)}`)
                            }
                        }}
                    >Mới nhất</button>
                    <button
                        style={{ backgroundColor: sortBy == 'priority' ? "#49CC90" : "white", border: sortBy == 'priority' ? "none" : "1px solid black", color: sortBy == 'priority' ? "white" : "black" }}
                        onClick={() => {
                            if (!window.location.href.includes('sortBy')) {
                                navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '')}&&sortBy=priority`)
                            } else {
                                navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '').replace(/(sortBy=)[^\&]+/, `$1priority`)}`)
                            }
                        }}
                    >Tin ưu tiên</button>
                    <select className="form-select form-select-sm mb-3" defaultValue="" onChange={(e: React.FormEvent) => {
                        if (!window.location.href.includes('sortBy')) {
                            navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '')}&&sortBy=${(e.target as any).value}`)
                        } else {
                            navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '').replace(/(sortBy=)[^\&]+/, `$1${(e.target as any).value}`)}`)
                        }

                    }}>
                        <option value="" disabled>Sort theo giá</option>
                        <option value='price-highToLow'>Giá: thấp đến cao</option>
                        <option value='price-lowToHigh'>Giá: cao đến thấp</option>
                    </select>
                    <select className="form-select form-select-sm mb-3" defaultValue="" onChange={(e: React.FormEvent) => {
                        if (!window.location.href.includes('address')) {
                            navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '')}&&address=${(e.target as any).value}`)
                        } else {
                            navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '').replace(/(address=)[^\&]+/, `$1${(e.target as any).value}`)}`)
                        }

                    }}>
                        <option value="" disabled>Địa điểm mua bán</option>
                        {cities.map(city => (
                            <option key={city.Id} value={city.Name}>{city.Name}</option>
                        ))}
                    </select>

                </div>

                <div className='content'>
                    <div className='all_item'>
                        {
                            activeProducts?.map((item) => {
                                return <>
                                    <div className="container_item"
                                        onClick={() => {
                                            window.location.href = `product-info?productId=${item.id}`
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
                                                <span>{formatTimeAgo(Number(item.postAt))}</span><span> - </span><span>{item.address.split("&&")[4].replace(/Thành phố|Tỉnh/g, "")}</span>
                                            </div>

                                        </div>
                                    </div>
                                </>
                            })
                        }
                    </div>
                    {/* Phan trang */}
                    <div className="pagination">
                        <span onClick={() => {
                            onPageChange(currentPage - 1)
                            navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '').replace(/(page=)[^\&]+/, `$1${currentPage - 1}`)}`)
                        }}>&lt;</span>
                        {renderPageNumbers()}
                        <span onClick={() => {
                            onPageChange(currentPage + 1)
                            navigate(`${window.location.href.replace(`${import.meta.env.VITE_WEBSITE_URL}`, '').replace(/(page=)[^\&]+/, `$1${currentPage + 1}`)}`)
                        }}>&gt;</span>
                    </div>

                </div>


            </div>

        </div>
    )
}
