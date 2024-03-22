import  { useEffect, useState } from 'react';
import './productInfo.scss'
import { useSelector, useDispatch } from 'react-redux';
import { convertToVND } from '@mieuteacher/meomeojs';
import { useParams, useLocation } from 'react-router-dom'
import { Modal } from 'antd';
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { Store } from '@/stores';
import { api } from '@/services/apis';
import { receiptAction } from '@/stores/slices/receipt.slice';
import { userAction } from '@/stores/slices/user.slice';
import { productAction } from '@/stores/slices/product.slice';
export default function ProductInfo() {
  const dispatch = useDispatch()
  const [detail, setDetail] = useState(null);
  const [product, setProduct] = useState(null);
  const [displayPic, setDisplayPic] = useState(false);
  const [user, setUser] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('productId');
  const authenStore = useSelector((store: Store) => store.authenStore)
  useEffect(() => {
    const fetchDataProduct = async () => {
      try {
        const res = await api.product.getProductById(Number(id));
        if (res.status == 200) {
          dispatch(productAction.setProductInfo(res.data.data));
          setProduct(res.data.data);
          setDetail(JSON.parse(res.data.data?.detail));
          setMainImage(`${import.meta.env.VITE_SV_HOST}/${res.data.data?.imgs[0]?.imgUrl}`)
        }
      } catch (err) {
        console.log(err);
        Modal.error({
          title: "Error",
          content: err.response?.data?.message || "Server Error!",
          onOk: () => {
            window.location.href = '/'
          }
        })
      }
    }
    fetchDataProduct();
  }, [])
  useEffect(() => {
    if (product) {
      const fetchData = async () => {
        try {
          const res = await api.user.getUserById(Number(product.userId));
          if (res.status === 200) {
            dispatch(userAction.setUserProduct(res.data.data));
            setUser(res.data.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [product]);



  const handleThumbnailHover = (thumbnailPath) => {
    setMainImage(thumbnailPath);
  };

  const { categoryName } = useParams()

  useEffect(() => {

  }, [categoryName])
  async function handleAddToCart(product) {
    try {
      if (product.userId == authenStore.data.id) {
        Modal.error({
          title: 'Error',
          content: "Bạn không thể lưu tin của chính mình!",
          onOk: () => {

          }
        })
        return
      }
      let item = {
        productId: product?.id
      }
      let result = await api.receipt.addToCart(item);
      Modal.success({
        title: "Notication",
        content: "Sản phẩm đã được thêm vào giỏ hàng của bạn!",
        onOk() { }
      })

      dispatch(receiptAction.setCart(result.data.data))
    } catch (err) {
      Modal.error({
        title: 'Error',
        content: err.response?.data?.message,
        onOk: () => {

        }
      })
      console.log('err', err);
    }
  }
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
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
    <div className='product_info_container'>
      <div className='product_info'>
        <div className='product_info_img'>
          <div className='img_show'>
            <h3>Hình ảnh sản phẩm: </h3>
            <div className="image-gallery">

              <div className="main-image">
                <img src={mainImage} alt="Main Image" onClick={() => { setDisplayPic(true) }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave} />
                {isHovered && (
                  <div className="overlay"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => { setDisplayPic(true) }}
                  >
                    <span className="text"><i className="fa-solid fa-magnifying-glass"></i> Phóng to</span>
                  </div>
                )}
              </div>
              <div className="thumbnail-images">
                {product?.imgs?.map(item => {
                  return (
                    <div className="thumbnail" onMouseEnter={() => handleThumbnailHover(`${import.meta.env.VITE_SV_HOST}/${item.imgUrl}`)}>
                      <img src={`${import.meta.env.VITE_SV_HOST}/${item.imgUrl}`} alt="Thumbnail 1" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="dashed">
            <div className="dashed-line"></div>
          </div>
          {
            product?.videoUrl && <>
              <h3>Video sản phẩm: </h3>
              <video
                id="videoPlayer"
                height="90%"
                width="100%"
                controls autoPlay={false}
                muted
              >
                <source
                  src={product.videoUrl && `${import.meta.env.VITE_SV_API_URL}/product/video/streaming/?code=${product?.videoUrl}`}
                  type="video/mp4"
                />
              </video>
            </>
          }

        </div>
        <div className='info_detail'>
          <div className='name'>
            <h4>{product?.name}</h4>
            <p>Tin đăng lúc: {formatTimeAgo(Number(product?.postAt))} </p>
          </div>
          <div className="dashed">
            <div className="dashed-line"></div>
          </div>

          <div className='detail'>
            <p><i className="fa-solid fa-map-location-dot"></i> Khu vực:</p>
            <p>{` ${product?.address.replace(/&&/g, ", ")} `}</p>
            <h5>{convertToVND(product?.price)}</h5>
          </div>
          <div className="dashed">
            <div className="dashed-line"></div>
          </div>
          <div className='desc'>
            <h5>Miêu tả sản phẩm:</h5>
            <span>
              {detail?.desc}
            </span>
          </div>

          <div className="dashed">
            <div className="dashed-line"></div>
          </div>
          <div className='checkout'>

            {product?.branchId == 6 && <button
              onClick={() => {
                handleAddToCart(product)

              }}>
              Mua ngay! <div className="star-1">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-2">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-3">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-4">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-5">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-6">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
            </button>}
            {product?.branchId !== 6 && <button
              onClick={() => {
                handleAddToCart(product)
              }}>
              Lưu tin! <div className="star-1">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-2">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-3">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-4">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-5">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
              <div className="star-6">
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 784.11 815.53"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    
                    fillRule: "evenodd",
                    clipRule: "evenodd"
                  }}
                  version="1.1"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs />
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer" />
                    <path
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      className="fil0"
                    />
                  </g>
                </svg>
              </div>
            </button>}
          </div>
          <div className="dashed">
            <div className="dashed-line"></div>
          </div>
          <div className='detail_product_info'>
            <h5>Thông tin chi tiết:</h5>
            <div className='table_box'>
              <MDBTable striped>
                <MDBTableBody>
                  {detail?.name &&
                    <tr>
                      <th scope='row'>Name</th>
                      <td>{detail?.name}</td>
                    </tr>}
                  {detail?.branch &&
                    <tr>
                      <th scope='row'>Branch</th>
                      <td>{detail?.branch}</td>
                    </tr>}
                  {detail?.floor &&
                    <tr>
                      <th scope='row'>Floor</th>
                      <td>{detail?.floor}</td>
                    </tr>}
                  {detail?.bedRoom &&
                    <tr>
                      <th scope='row'>BedRoom</th>
                      <td>{detail?.bedRoom}</td>
                    </tr>}
                  {detail?.badRoom &&
                    <tr>
                      <th scope='row'>BadRoom</th>
                      <td>{detail?.badRoom}</td>
                    </tr>}
                  {detail?.papers &&
                    <tr>
                      <th scope='row'>Legal documents</th>
                      <td>{detail?.papers}</td>
                    </tr>}
                  {detail?.decoration &&
                    <tr>
                      <th scope='row'>Decoration Status</th>
                      <td>{detail?.decoration}</td>
                    </tr>}
                  {detail?.moreInfo &&
                    <tr>
                      <th scope='row'>More Infomation</th>
                      <td>{detail?.moreInfo}</td>
                    </tr>}
                  {detail?.area &&
                    <tr>
                      <th scope='row'>Acreage</th>
                      <td>{detail?.area} (m²)</td>
                    </tr>}



                </MDBTableBody>
              </MDBTable>
            </div>
            <div className='product_more_container'>
              <div className='product_info_more' onClick={() => {
                setShowInfo(!showInfo)
              }}>See more content...   <ion-icon name="chevron-down-outline"></ion-icon>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className='info'>
        <div className='company'>
          <div className='top'>
            <img src={user?.avatar.includes('img/') ? `${import.meta.env.VITE_SV_HOST}/${user?.avatar}` : `${user?.avatar}`}></img>
            <div className='info_user'>
              <p>{user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.userName}</p>
              <h6>Lần đăng nhập cuối: {formatTimeAgo(Number(user?.lastLogin))}</h6>
            </div>
            <svg
              fill="currentColor"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 477.867 477.867"
              className="css-1ptts6n"
              color="green"
              height={14}
              width={14}
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: 8, marginBottom: 4 }}
            >
              <g>
                <g>
                  <path
                    d="(m²)38.933,0C106.974,0,0,106.974,0,238.933s106.974,238.933,238.933,238.933s238.933-106.974,238.933-238.933
			C477.726,107.033,370.834,0.141,238.933,0z M370.466,165.666L199.799,336.333c-6.665,6.663-17.468,6.663-24.132,0l-68.267-68.267
			c-6.78-6.548-6.968-17.352-0.42-24.132c6.548-6.78,17.352-6.968,24.132-0.42c0.142,0.138,0.282,0.277,0.42,0.42l56.201,56.201
			l158.601-158.601c6.78-6.548,17.584-6.36,24.132,0.419C376.854,148.567,376.854,159.052,370.466,165.666z"
                  />
                </g>
              </g>
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
            </svg>
          </div>
          <div className='btn_box' >
            <button><i className="fa-solid fa-user-plus"></i> Theo dõi</button>
            <button><i className="fa-solid fa-store"></i> Xem cửa hàng</button>
          </div>
        </div>
        {
          product?.priorityStatus == "active" && <div className='policy'>
            <div className='poli_content'>
              <div className='priority_logo'>
                <img src="https://www.ganemo.co/web/image/product.template/513/image_1024?unique=eaa03e2" alt="" />
                <span>ĐỐI TÁC</span>
              </div>
              <span>Là Đối Tác Chợ Tốt <i className="fa-solid fa-user-shield"></i></span>
            </div>
            <div className="styles_contentTrusted__aX7Ef">Cam kết hàng đúng mô tả, bảo hành ít nhất 3 tháng, hỗ trợ đổi trả.<a className="styles_moreInfo__tdGGQ" target="_blank" rel="nofollow noreferrer" href="https://trogiup.chotot.com/nguoi-ban/doi-tac-cho-tot/">Tìm hiểu thêm</a></div>
          </div>
        }

        <div className='policy'>
          <h5>Liên hệ với người bán</h5>
          <button><i className="fa-solid fa-phone"></i> SĐT: {user?.phoneNumber ? user?.phoneNumber : "Đang cập nhật!"}</button>
        </div>

        <div className='policy'>
          <h5>Chính sách bán hàng</h5>
          <img src='https://lh3.googleusercontent.com/uvWBg1q90XtEWvHkWGDbDemjEaANJ_kX3NEfIywURPTMeaSZTORdttpehuFBNKpYiWQ3jHgito4ciCt9pEJIHH1V4IlPYoE=rw'></img><span>Miễn phí giao hàng cho đơn hàng từ 5 triệu</span><br />
          <img src='https://lh3.googleusercontent.com/LT3jrA76x0rGqq9TmqrwY09FgyZfy0sjMxbS4PLFwUekIrCA9GlLF6EkiFuKKL711tFBT7f2JaUgKT3--To8zOW4kHxPPHs4=rw'></img><span>Cam kết hàng chính hãng 100% </span>
        </div>

      </div>
      {
        showInfo &&
        <div className='product_info_container' >
          <div className='product_info_background' onClick={() => { setShowInfo(!showInfo) }}></div>
          <div className='product_info_content'>
            <h5>Thông tin chi tiết:</h5>
            {
              <MDBTable striped>
                <MDBTableBody>
                  {detail?.name &&
                    <tr>
                      <th scope='row'>Name</th>
                      <td>{detail?.name}</td>
                    </tr>}
                  {detail?.type &&
                    <tr>
                      <th scope='row'>Type</th>
                      <td>{detail?.type}</td>
                    </tr>}
                  {detail?.used &&
                    <tr>
                      <th scope='row'>Status</th>
                      <td>{detail?.used}</td>
                    </tr>}
                  {detail?.color &&
                    <tr>
                      <th scope='row'>Color</th>
                      <td>{detail?.color}</td>
                    </tr>}
                  {detail?.ram &&
                    <tr>
                      <th scope='row'>RAM</th>
                      <td>{detail?.ram}</td>
                    </tr>}
                  {detail?.guarantee &&
                    <tr>
                      <th scope='row'>Warranty</th>
                      <td>{detail?.guarantee}</td>
                    </tr>}
                  {detail?.RegisteredAt &&
                    <tr>
                      <th scope='row'>Registered At</th>
                      <td>{detail?.RegisteredAt}</td>
                    </tr>}

                  {detail?.branch &&
                    <tr>
                      <th scope='row'>Branch</th>
                      <td>{detail?.branch}</td>
                    </tr>}
                  {detail?.cc &&
                    <tr>
                      <th scope='row'>Cylinder capacity</th>
                      <td>{detail?.cc}</td>
                    </tr>}
                  {detail?.motoId &&
                    <tr>
                      <th scope='row'>License plates</th>
                      <td>{detail?.motoId}</td>
                    </tr>}
                  {detail?.km &&
                    <tr>
                      <th scope='row'>Number of kilometers run</th>
                      <td>{detail?.km}</td>
                    </tr>}
                  {detail?.from &&
                    <tr>
                      <th scope='row'>Comes from</th>
                      <td>{detail?.from}</td>
                    </tr>}
                  {detail?.areaName &&
                    <tr>
                      <th scope='row'>Area Name</th>
                      <td>{detail?.areaName}</td>
                    </tr>}
                  {detail?.landNum &&
                    <tr>
                      <th scope='row'>Land Number</th>
                      <td>{detail?.landNum}</td>
                    </tr>}
                  {detail?.direction &&
                    <tr>
                      <th scope='row'>Direction</th>
                      <td>{detail?.direction}</td>
                    </tr>}
                  {detail?.direction &&
                    <tr>
                      <th scope='row'>Direction</th>
                      <td>{detail?.direction}</td>
                    </tr>}
                  {detail?.floor &&
                    <tr>
                      <th scope='row'>Floor</th>
                      <td>{detail?.floor}</td>
                    </tr>}
                  {detail?.bedRoom &&
                    <tr>
                      <th scope='row'>BedRoom</th>
                      <td>{detail?.bedRoom}</td>
                    </tr>}
                  {detail?.badRoom &&
                    <tr>
                      <th scope='row'>BadRoom</th>
                      <td>{detail?.badRoom}</td>
                    </tr>}
                  {detail?.papers &&
                    <tr>
                      <th scope='row'>Legal documents</th>
                      <td>{detail?.papers}</td>
                    </tr>}
                  {detail?.decoration &&
                    <tr>
                      <th scope='row'>Decoration Status</th>
                      <td>{detail?.decoration}</td>
                    </tr>}
                  {detail?.moreInfo &&
                    <tr>
                      <th scope='row'>More Infomation</th>
                      <td>{detail?.moreInfo}</td>
                    </tr>}
                  {detail?.area &&
                    <tr>
                      <th scope='row'>Acreage</th>
                      <td>{detail?.area} {detail?.unit ? detail?.unit : `(m²)`}</td>
                    </tr>}
                  {detail?.useArea &&
                    <tr>
                      <th scope='row'>Used Acreage</th>
                      <td>{detail?.useArea} (m²)</td>
                    </tr>}
                  {detail?.xSide &&
                    <tr>
                      <th scope='row'>Horizontal Length</th>
                      <td>{detail?.xSide} (m²)</td>
                    </tr>}
                  {detail?.ySide &&
                    <tr>
                      <th scope='row'>Vertical Length</th>
                      <td>{detail?.ySide} (m²)</td>
                    </tr>}


                </MDBTableBody>
              </MDBTable>
            }

          </div>
        </div>
      }
      {displayPic && <>
        <div className='form_box'>
          <div className='content'>
            <span onClick={() => {
              setDisplayPic(false)
            }
            }>X</span>
            <img src={mainImage}></img>
          </div>
        </div>
      </>}
    </div>
  )
}