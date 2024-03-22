import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Modal } from 'antd'
import { randomId, convertToVND } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import DetailShow from './components/DetailShow'
import DescribeShow from './components/DescribeShow';
import './list.scss'
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAction } from '@/stores/slices/product.slice';
import { api } from '@/services/apis';
import { Store } from '@/stores';
import EditProduct from './components/EditProduct';
export default function List() {
  const navigate = useNavigate();
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
  const page = Number(searchParams.get('page'));
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const dispatch = useDispatch()
  const productStore = useSelector((store: Store) => store.productStore)

  const [showDes, setShowDes] = useState(false);
  const [updateData, setupdateData] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [detail, setDetail] = useState(null)
  const [displayPic, setDisplayPic] = useState(false);
  const [displayVideo, setDisplayVideo] = useState(false);
  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [timer, setTimer] = useState(null);
  const [activeProductCount, setActiveProductCount] = useState(0);
  const [waitingProductCount, setWaitingProductCount] = useState(0);
  const [doneProductCount, setDoneProductCount] = useState(0);
  const [refusedProductCount, setRefusedProductCount] = useState(0);
  const [hiddenProductCount, setHiddenProductCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [showInfoNoEdit, setShowInfoNoEdit] = useState(null);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleHover = () => {
    setIsHovered((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.product.getStatusCount(-1);
        if (res.status === 200) {
          setActiveProductCount(res.data.data.activeProductCount);
          setWaitingProductCount(res.data.data.waitingProductCount)
          setDoneProductCount(res.data.data.doneProductCount)
          setRefusedProductCount(res.data.data.refusedProductCount)
          setHiddenProductCount(res.data.data.hiddenProductCount)
          if (status == 'active') {
            setTotalPages(Math.ceil(res.data.data.activeProductCount / 18))
          }
          if (status == 'inactive') {
            setTotalPages(Math.ceil(res.data.data.waitingProductCount / 18))
          }
          if (status == 'done') {
            setTotalPages(Math.ceil(res.data.data.doneProductCount / 18))
          }
          if (status == 'deny') {
            setTotalPages(Math.ceil(res.data.data.refusedProductCount / 18))
          }
          if (status == 'delete') {
            setTotalPages(Math.ceil(res.data.data.hiddenProductCount / 18))
          }

        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

  }, [status, productStore.product])
  useEffect(() => {
    if (!localStorage.getItem("tokenMember")) return
    const fetchData = async () => {
      if (status) {
        try {
          const res = await api.product.getAllProduct(userId == "all" ? -1 : Number(userId), status, (page != 0) ? Number(page) : 1);
          if (res.status == 200) {
            dispatch(productAction.setData(res.data.data));

          }
        } catch (err) {
          console.log(err);
        }
      }

    }
    fetchData();
  }, [page, status])

  useEffect(() => {
    if (isHovered) {
      setTimer(
        setInterval(() => {
          goToNextSlide();
        }, 3000)
      );
    } else {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isHovered]);
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
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
          if (!window.location.href.includes('page')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&page=${page}`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(page=)[^\&]+/, `$1${page}`)}`)
          }
        }}
      >
        {page}
      </span>
    ));
  };

  return (
    <div className='user_info_box'>
      <div className='news_manager'>
        <div className='new_content' onClick={() => {
          if (!window.location.href.includes('status')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&status=active`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(status=)[^\&]+/, `$1active`)}`)
          }
        }}>
          <p style={status == 'active' ? { color: "blue", fontWeight: 600 } : { color: "black" }}>Tin đang rao ({activeProductCount})</p>
        </div>
        <div className='new_content' onClick={() => {
          if (!window.location.href.includes('status')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&status=inactive`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(status=)[^\&]+/, `$1inactive`)}`)
          }
        }}>
          <p style={status == 'inactive' ? { color: "blue", fontWeight: 600 } : { color: "black" }}>Tin chờ duyệt ({waitingProductCount})</p>
        </div>
        <div className='new_content' onClick={() => {
          if (!window.location.href.includes('status')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&status=done`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(status=)[^\&]+/, `$1done`)}`)
          }
        }}>
          <p style={status == 'done' ? { color: "blue", fontWeight: 600 } : { color: "black" }}>Tin đã bán ({doneProductCount})</p>
        </div>
        <div className='new_content' onClick={() => {
          if (!window.location.href.includes('status')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&status=deny`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(status=)[^\&]+/, `$1deny`)}`)
          }
        }}>
          <p style={status == 'deny' ? { color: "blue", fontWeight: 600 } : { color: "black" }}>Tin bị từ chối ({refusedProductCount})</p>
        </div>
        <div className='new_content' onClick={() => {
          if (!window.location.href.includes('status')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&status=delete`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(status=)[^\&]+/, `$1delete`)}`)
          }
        }}>
          <p style={status == 'delete' ? { color: "blue", fontWeight: 600 } : { color: "black" }}>Tin đã ẩn ({hiddenProductCount})</p>
        </div>
      </div>

      {!status && <>
        <img src='https://data.vieclamcantho.edu.vn/static-bucket/2023/4/5/product-manager.jpg'></img>
      </>}
      {
        showDes && <DescribeShow showDes={showDes} setShowDes={setShowDes} updateData={updateData} setupdateData={setupdateData} />
      }
      {
        showInfo && <DetailShow showInfo={showInfo} setShowInfo={setShowInfo} updateData={updateData} setupdateData={setupdateData} />
      }
      {
        showInfoNoEdit && <div className='product_info_container' >
          <div className='product_info_background' onClick={() => { setShowInfoNoEdit(!showInfoNoEdit) }}></div>
          <div className='product_info_content'>
            <h5>Thông tin chi tiết:</h5>
            {
              <MDBTable striped>
                <MDBTableBody>
                  {detail.name &&
                    <tr>
                      <th scope='row'>Name</th>
                      <td>{detail.name}</td>
                    </tr>}
                  {detail.type &&
                    <tr>
                      <th scope='row'>Type</th>
                      <td>{detail.type}</td>
                    </tr>}
                  {detail.used &&
                    <tr>
                      <th scope='row'>Status</th>
                      <td>{detail.used}</td>
                    </tr>}
                  {detail.color &&
                    <tr>
                      <th scope='row'>Color</th>
                      <td>{detail.color}</td>
                    </tr>}
                  {detail.ram &&
                    <tr>
                      <th scope='row'>RAM</th>
                      <td>{detail.ram}</td>
                    </tr>}
                  {detail.guarantee &&
                    <tr>
                      <th scope='row'>Warranty</th>
                      <td>{detail.guarantee}</td>
                    </tr>}
                  {detail.RegisteredAt &&
                    <tr>
                      <th scope='row'>Registered At</th>
                      <td>{detail.RegisteredAt}</td>
                    </tr>}

                  {detail.branch &&
                    <tr>
                      <th scope='row'>Branch</th>
                      <td>{detail.branch}</td>
                    </tr>}
                  {detail.cc &&
                    <tr>
                      <th scope='row'>Cylinder capacity</th>
                      <td>{detail.cc}</td>
                    </tr>}
                  {detail.motoId &&
                    <tr>
                      <th scope='row'>License plates</th>
                      <td>{detail.motoId}</td>
                    </tr>}
                  {detail.km &&
                    <tr>
                      <th scope='row'>Number of kilometers run</th>
                      <td>{detail.km}</td>
                    </tr>}
                  {detail.from &&
                    <tr>
                      <th scope='row'>Comes from</th>
                      <td>{detail.from}</td>
                    </tr>}
                  {detail.areaName &&
                    <tr>
                      <th scope='row'>Area Name</th>
                      <td>{detail.areaName}</td>
                    </tr>}
                  {detail.landNum &&
                    <tr>
                      <th scope='row'>Land Number</th>
                      <td>{detail.landNum}</td>
                    </tr>}
                  {detail.direction &&
                    <tr>
                      <th scope='row'>Direction</th>
                      <td>{detail.direction}</td>
                    </tr>}
                  {detail.direction &&
                    <tr>
                      <th scope='row'>Direction</th>
                      <td>{detail.direction}</td>
                    </tr>}
                  {detail.floor &&
                    <tr>
                      <th scope='row'>Floor</th>
                      <td>{detail.floor}</td>
                    </tr>}
                  {detail.bedRoom &&
                    <tr>
                      <th scope='row'>BedRoom</th>
                      <td>{detail.bedRoom}</td>
                    </tr>}
                  {detail.badRoom &&
                    <tr>
                      <th scope='row'>BadRoom</th>
                      <td>{detail.badRoom}</td>
                    </tr>}
                  {detail.papers &&
                    <tr>
                      <th scope='row'>Legal documents</th>
                      <td>{detail.papers}</td>
                    </tr>}
                  {detail.decoration &&
                    <tr>
                      <th scope='row'>Decoration Status</th>
                      <td>{detail.decoration}</td>
                    </tr>}
                  {detail.moreInfo &&
                    <tr>
                      <th scope='row'>More Infomation</th>
                      <td>{detail.moreInfo}</td>
                    </tr>}
                  {detail.area &&
                    <tr>
                      <th scope='row'>Acreage</th>
                      <td>{detail.area} {detail.unit ? detail.unit : `(m²)`}</td>
                    </tr>}
                  {detail.useArea &&
                    <tr>
                      <th scope='row'>Used Acreage</th>
                      <td>{detail.useArea} (m²)</td>
                    </tr>}
                  {detail.xSide &&
                    <tr>
                      <th scope='row'>Horizontal Length</th>
                      <td>{detail.xSide} (m²)</td>
                    </tr>}
                  {detail.ySide &&
                    <tr>
                      <th scope='row'>Vertical Length</th>
                      <td>{detail.ySide} (m²)</td>
                    </tr>}


                </MDBTableBody>
              </MDBTable>
            }

          </div>
        </div>
      }

      {
        displayPic && <div className='product_describe_form'>
          <div className='carousel_box'>
            <button onClick={() => {
              setDisplayPic(!displayPic)
            }} type='button' className='btn btn-danger del_pic'>X</button>
            <div className='carousel_app'>
              <div
                className="carousel"
                style={{ width: '80%', height: '640px' }}
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
              >
                <img src={`${import.meta.env.VITE_SV_HOST}/${images[currentIndex].imgUrl}`} alt="carousel slide" />

                {isHovered && (
                  <div className="navigation">
                    <button type="button" className="btn " onClick={goToPrevSlide}><ion-icon name="chevron-back-outline"></ion-icon></button>
                    <button type="button" className="btn " onClick={goToNextSlide}><ion-icon name="chevron-forward-outline"></ion-icon></button>
                  </div>
                )}

                <div className="mydots">
                  {images.map((image, index) => (
                    <span
                      key={index + image}
                      className={index === currentIndex ? 'active' : ''}
                      onClick={() => setCurrentIndex(index)}
                    ></span>
                  ))}
                </div>

              </div>

            </div>

          </div>
        </div>
      }
      {
        displayVideo && <div className='product_describe_form'>
          <div className='carousel_box'>
            <button onClick={() => {
              setDisplayVideo(!displayVideo)
            }} type='button' className='btn btn-danger close'>X</button>
            <div className='carousel_app'>

              <video
                id="videoPlayer"
                height="90%"
                width="100%"
                controls autoPlay={false}
              >
                <source
                  src={`${import.meta.env.VITE_SV_API_URL}/product/video/streaming/?code=${video}`}
                  type="video/mp4"
                />
              </video>

            </div>

          </div>
        </div>
      }

      {
        showEditProduct && <EditProduct showEditProduct={showEditProduct} setShowEditProduct={setShowEditProduct} updateData={updateData} />
      }
      {/* {
                showDetail && <DetailShow showDetail={showDetail} setShowDetail={setShowDetail} updateData={updateData} setupdateData={setupdateData} />
            }
            {
                showEdit && <ProductEdit showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} setupdateData={setupdateData} />
            } */}
      {status == 'active' && <>
        <h4>Sản phẩm đã được duyệt </h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              {/* <th>Category</th>
                        <th>Brand</th> */}
              <th>Price</th>
              <th>Status</th>
              <th>Des</th>
              <th>Detail</th>
              <th>Pic</th>
              <th>Video</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {
              productStore.product.length != 0 ? productStore.product?.map((product) => {
                if (product.status == "active" && product.moderationStatus == "active") {
                  return (
                    <tr key={randomId()}>
                      <td>{product.id}</td>
                      <td>
                        <img
                          onClick={() => {
                            window.location.href = `/product-info?productId=${product.id}`
                          }}
                          src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer" }} />
                      </td>
                      <td >{product.name}</td>
                      <td>{convertToVND(product.price)}</td>
                      <td>{product.priorityStatus == "active" ? <span className='priority_logo_vip'>
                        <i className="fa-regular fa-circle-up"></i>
                        <span>ƯU TIÊN</span>
                      </span> : <><span>No priority</span>

                      </>}
                        <p style={{ color: "gray", fontSize: 11, margin: 5 }}>{formatTimeAgo(Number(product?.postAt))} </p>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setShowDes(!showDes);
                            setupdateData({ id: product.id, detail: JSON.parse(product.detail) })
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            // setShowDetail(!showDetail);
                            // setupdateData({ id: product.id, category: product.category.title, detail: JSON.parse(product.detail) })
                            setShowInfo(!showInfo);
                            setupdateData({ id: product.id, detail: JSON.parse(product.detail) })
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          className='btn btn-primary'
                          onClick={() => {
                            setDisplayPic(true)
                            setImages(product.imgs)
                            setupdateData({ id: product.id })
                          }}
                        >
                          More
                        </button>
                      </td>
                      <td>
                        {product.videoUrl ? <button
                          className='btn btn-primary'
                          onClick={() => {
                            setDisplayVideo(true)
                            setVideo(product.videoUrl)
                            setupdateData({ id: product.id })
                          }}
                        >
                          More
                        </button> : <span>None</span>}
                      </td>
                      <td style={{ display: 'flex', flexDirection: 'row' }}>

                        {/* Đẩy tin */}
                        <button
                          onClick={() => {
                            setShowEditProduct(!showEditProduct);
                            setupdateData(product)
                          }}
                          style={{ marginRight: 5 }}
                          className='btn btn-info'>More</button>
                        {
                          <button
                            onClick={() => {
                              Modal.confirm({
                                title: "Warning",
                                content: `Are you sure you want to refuse this product?`,
                                onOk: async () => {
                                  try {
                                    let result = await api.product.updateByAdmin(product.id, { status: 'deny' })
                                    if (result.status == 200) {
                                      dispatch(productAction.update(result.data.data))
                                    }
                                  } catch (err) {
                                    console.log('err', err);
                                  }
                                },
                                onCancel: () => { }

                              })
                            }}
                            className="btn btn-danger"
                          >Deny</button>
                        }
                      </td>
                    </tr>
                  )
                }
              }) : <img src='https://craftzone.in/assets/img/no-product.png'></img>
            }
          </tbody>
        </Table >
      </>
      }

      {status == 'inactive' && <>
        <h4>Sản phẩm đang chờ duyệt </h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              {/* <th>Category</th>
                        <th>Brand</th> */}
              <th>Price</th>
              <th>Status</th>
              <th>Des</th>
              <th>Detail</th>
              <th>Pic</th>
              <th>Video</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {
              productStore.product.length != 0 ? productStore.product?.map((product) => {
                if (product.status == "inactive") {
                  return (
                    <tr key={randomId()}>
                      <td>{product.id}</td>
                      <td>
                        <img
                          onClick={() => {
                            window.location.href = `/product-info?productId=${product.id}`
                          }}
                          src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer" }} />
                      </td>
                      <td >{product.name}</td>
                      <td>{convertToVND(product.price)}</td>
                      <td>{product.priorityStatus == "active" ? <span className='priority_logo_vip'>
                        <i className="fa-regular fa-circle-up"></i>
                        <span>ƯU TIÊN</span>
                      </span> : <span>No priority</span>}
                        <p style={{ color: "gray", fontSize: 11, margin: 5 }}>{formatTimeAgo(Number(product?.createAt))} </p>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setShowDes(!showDes);
                            setupdateData({ id: product.id, detail: JSON.parse(product.detail) })
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            // setShowDetail(!showDetail);
                            // setupdateData({ id: product.id, category: product.category.title, detail: JSON.parse(product.detail) })
                            setShowInfo(!showInfo);
                            setupdateData({ id: product.id, detail: JSON.parse(product.detail) })
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          className='btn btn-primary'
                          onClick={() => {
                            setDisplayPic(true)
                            setImages(product.imgs)
                            setupdateData({ id: product.id })
                          }}
                        >
                          More
                        </button>
                      </td>
                      <td>
                        {product.videoUrl ? <button
                          className='btn btn-primary'
                          onClick={() => {
                            setDisplayVideo(true)
                            setVideo(product.videoUrl)
                            setupdateData({ id: product.id })
                          }}
                        >
                          More
                        </button> : <span>None</span>}
                      </td>
                      <td style={{ display: 'flex', flexDirection: 'row' }}>

                        <button
                          onClick={() => {
                            setShowEditProduct(!showEditProduct);
                            setupdateData(product)
                          }}
                          style={{ marginRight: 5 }}
                          className='btn btn-info'>Edit</button>
                        <button
                          style={{ marginRight: 5 }}
                          onClick={() => {
                            Modal.confirm({
                              title: "Warning",
                              content: `Are you sure you want to agree this product?`,
                              onOk: async () => {
                                try {
                                  let result = await api.product.updateByAdmin(product.id, { status: 'active', postAt: String(Date.now()) })
                                  if (result.status == 200) {
                                    dispatch(productAction.update(result.data.data))
                                  }
                                } catch (err) {
                                  console.log('err', err);
                                }
                              },
                              onCancel: () => { }

                            })
                          }}
                          className="btn btn-success"
                        >Agree</button>
                        {
                          <button
                            onClick={() => {
                              Modal.confirm({
                                title: "Warning",
                                content: `Are you sure you want to refuse this product?`,
                                onOk: async () => {
                                  try {
                                    let result = await api.product.updateByAdmin(product.id, { status: 'deny' })
                                    if (result.status == 200) {
                                      dispatch(productAction.update(result.data.data))
                                    }
                                  } catch (err) {
                                    console.log('err', err);
                                  }
                                },
                                onCancel: () => { }

                              })
                            }}
                            className="btn btn-danger"
                          >Deny</button>
                        }
                      </td>
                    </tr>
                  )
                }
              }) : <img src='https://craftzone.in/assets/img/no-product.png'></img>
            }
          </tbody>
        </Table >
      </>
      }

      {status == 'done' && <>
        <h4>Sản phẩm đã được bán </h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              {/* <th>Category</th>
                        <th>Brand</th> */}
              <th>Price</th>
              <th>Done At</th>
              <th>Des</th>
              <th>Detail</th>
              <th>Pic</th>
              <th>Video</th>
            </tr>
          </thead>
          <tbody>
            {
              productStore.product.length != 0 ? productStore.product?.map((product) => {
                if (product.status == "done") {
                  return (
                    <tr key={randomId()}>
                      <td>{product.id}</td>
                      <td>
                        <img src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                      </td>
                      <td >{product.name}</td>
                      <td>{convertToVND(product.price)}</td>
                      <td>{formatTimeAgo(Number(product?.updateAt))}</td>
                      <td>
                        <button
                          onClick={() => {
                            setShowDes(!showDes);
                            setupdateData({ id: product.id, detail: JSON.parse(product.detail) })
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            // setShowDetail(!showDetail);
                            // setupdateData({ id: product.id, category: product.category.title, detail: JSON.parse(product.detail) })
                            setShowInfoNoEdit(!showInfoNoEdit);
                            setDetail(JSON.parse(product.detail))
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          className='btn btn-primary'
                          onClick={() => {
                            setDisplayPic(true)
                            setImages(product.imgs?.map(item => item.imgUrl))
                          }}
                        >
                          More
                        </button>
                      </td>
                      <td>
                        {product.videoUrl ? <button
                          className='btn btn-primary'
                          onClick={() => {
                            setDisplayVideo(true)
                            setVideo(product.videoUrl)
                          }}
                        >
                          More
                        </button> : <span>None</span>}
                      </td>
                    </tr>
                  )
                }
              }) : <img src='https://craftzone.in/assets/img/no-product.png'></img>
            }
            {

            }
          </tbody>
        </Table >
      </>
      }

      {status == 'deny' && <>
        <h4>Sản phẩm bị Rao Vặt từ chối đăng tin hoặc bị khóa</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              {/* <th>Category</th>
                        <th>Brand</th> */}
              <th>Price</th>
              <th>Status</th>
              <th>Des</th>
              <th>Detail</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {
              productStore.product.length != 0 ? productStore.product?.map((product) => {
                if (product.status == "deny") {
                  return (
                    <tr key={randomId()}>
                      <td>{product.id}</td>
                      <td>
                        <img src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                      </td>
                      <td >{product.name}</td>
                      <td>{convertToVND(product.price)}</td>
                      <td>{product.priorityStatus == "active" ? <span className='priority_logo_vip'>
                        <i className="fa-regular fa-circle-up"></i>
                        <span>ƯU TIÊN</span>
                      </span> : <span>No priority</span>}</td>
                      <td>
                        <button
                          onClick={() => {
                            setShowDes(!showDes);
                            setupdateData({ id: product.id, detail: JSON.parse(product.detail) })
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            // setShowDetail(!showDetail);
                            // setupdateData({ id: product.id, category: product.category.title, detail: JSON.parse(product.detail) })
                            setShowInfo(!showInfo);
                            setDetail(JSON.parse(product.detail))
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            Modal.confirm({
                              title: "Warning",
                              content: `Are you sure you want to undo this product?`,
                              onOk: async () => {
                                try {
                                  let result = await api.product.updateByAdmin(product.id, { status: 'inactive' })
                                  if (result.status == 200) {
                                    dispatch(productAction.update(result.data.data))
                                  }
                                } catch (err) {
                                  console.log('err', err);
                                }
                              },
                              onCancel: () => { }

                            })
                          }}
                          className="btn btn-info"
                        >Undo</button>
                      </td>
                    </tr>
                  )
                }
              }) : <img src='https://craftzone.in/assets/img/no-product.png'></img>
            }
            {

            }
          </tbody>
        </Table >
      </>
      }
      {status == 'delete' && <>
        <h4>Sản phẩm mà bạn đã ẩn</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              {/* <th>Category</th>
                        <th>Brand</th> */}
              <th>Price</th>
              <th>Status</th>
              <th>Delete At</th>
              <th>Des</th>
              <th>Detail</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {
              productStore.product.length != 0 ? productStore.product?.map((product) => {
                if (product.status == "delete") {
                  return (
                    <tr key={randomId()}>
                      <td>{product.id}</td>
                      <td>
                        <img src={`${import.meta.env.VITE_SV_HOST}/${product.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                      </td>
                      <td >{product.name}</td>
                      <td>{convertToVND(product.price)}</td>
                      <td>{product.priorityStatus == "active" ? <span className='priority_logo_vip'>
                        <i className="fa-regular fa-circle-up"></i>
                        <span>ƯU TIÊN</span>
                      </span> : <span>No priority</span>}</td>
                      <td>{formatTimeAgo(Number(product?.updateAt))}</td>
                      <td>
                        <button
                          onClick={() => {
                            setShowInfoNoEdit(!showInfoNoEdit);
                            setDetail(JSON.parse(product.detail))
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            // setShowDetail(!showDetail);
                            // setupdateData({ id: product.id, category: product.category.title, detail: JSON.parse(product.detail) })
                            setShowInfo(!showInfo);
                            setDetail(JSON.parse(product.detail))
                          }}
                          className='btn btn-primary'>More</button>
                      </td>
                      <td>

                      </td>
                    </tr>
                  )
                }
              }) : <img src='https://craftzone.in/assets/img/no-product.png'></img>
            }
            {

            }
          </tbody>
        </Table >
      </>
      }
      {/* Phan trang */}
      <div className="pagination">
        <span onClick={() => {
          onPageChange(currentPage - 1)
          if (!window.location.href.includes('page')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&page=${currentPage - 1}`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(page=)[^\&]+/, `$1${currentPage - 1}`)}`)
          }
        }}>&lt;</span>
        {renderPageNumbers()}
        <span onClick={() => {
          onPageChange(currentPage + 1)
          if (!window.location.href.includes('page')) {
            navigate(`${window.location.href.replace('http://localhost:5173', '')}&&page=${currentPage - 1}`)
          } else {
            navigate(`${window.location.href.replace('http://localhost:5173', '').replace(/(page=)[^\&]+/, `$1${currentPage + 1}`)}`)
          }
        }}>&gt;</span>
      </div>


    </div>
  )
}