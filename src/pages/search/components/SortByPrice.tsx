import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { convertToVND } from '@mieuteacher/meomeojs';



export default function SortByPrice({ setSelectedValue, selectedValue, activeProducts }) {
    const navigate = useNavigate()
    const [product, setProduct] = useState([])
    console.log('activeProducts', activeProducts);

    // Sắp xếp sản phẩm dựa trên giá tiền
    useEffect(() => {

        if (selectedValue == 'highToLow') {
            setProduct([...[...activeProducts]?.sort((a, b) => a.price - b.price)])
        } else if (selectedValue == 'lowToHigh') {
            setProduct([...[...activeProducts]?.sort((a, b) => b.price - a.price)])
        }
    }, [selectedValue])
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
    return (
        <>
            {product
                ?.map((item) => {
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
        </>
    )

}
