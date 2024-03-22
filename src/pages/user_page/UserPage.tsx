import { useEffect, useRef, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Modal, message } from 'antd'
import { randomId, convertToVND } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import DetailShow from './components/DetailShow'
import DescribeShow from './components/DescribeShow';
import './userPage.scss'
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAction } from '@/stores/slices/product.slice';
import { api } from '@/services/apis';
import { Store } from '@/stores';
import UserAvatar from './components/UserAvatar';
import UserInfo from './components/UserInfo';
import { authenAction } from '@/stores/slices/authen.slice';
import EditProduct from './components/EditProduct';

export default function UserPage() {
  const navigate = useNavigate();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh' // Múi giờ Việt Nam (GMT+7)
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = Number(searchParams.get('page'));

  const status = searchParams.get('status');
  const dispatch = useDispatch()
  const MAX_IMAGES = 6;
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 megabytes
  const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 megabytes
  const MAX_IMAGE_WIDTH = 240;
  const MAX_IMAGE_HEIGHT = 240;
  const inputRef = useRef(null)
  const videoRef = useRef(null)
  const productStore = useSelector((store: Store) => store.productStore)
  const authenStore = useSelector((store: Store) => store.authenStore)

  const [showDes, setShowDes] = useState(false);
  const [updateData, setupdateData] = useState({});
  const [showAvatar, setShowAvatar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [detail, setDetail] = useState(null)
  const [displayPic, setDisplayPic] = useState(false);
  const [displayChangePic, setDisplayChangePic] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [displayVideo, setDisplayVideo] = useState(false);
  const [displayChangeVideo, setDisplayChangeVideo] = useState(false);
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [imagesToChange, setImagesToChange] = useState(null);
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
        const res = await api.product.getStatusCount(Number(authenStore.data.id));
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
    if (!localStorage.getItem("token")) return
    const fetchData = async () => {
      if (status) {
        try {
          const res = await api.product.getProductByUserId(Number(authenStore.data.id), status, (page != 0) ? Number(page) : 1);
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
  const handleVideo = () => {
    videoRef.current.click();
  }
  const handlePic = () => {
    inputRef.current.click();
  }
  const handleVideoChange = (event: React.FormEvent) => {
    const file = (event.target as any).files[0];
    console.log(file);

    if (!file.type.includes("video")) {
      message.warning(`${file.name} có định dạng không thích hợp.`);
      message.warning("Đã tải video lên thất bại!");
      setSelectedVideo(null)
      return
    }

    if (file.size > MAX_VIDEO_SIZE) {
      message.warning(`Video ${file.name} có dung lượng vượt quá 500MB.`);
      message.warning("Đã tải video lên thất bại!");
      setSelectedVideo(null)
      return
    }

    setSelectedVideo(file);
    message.success("Đã tải video lên thành công!");
    (event.target as any).files = null;
    // Xử lý tập tin đã chọn ở đây
  };
  const handeUpdateVideo = () => {
    let videoData = new FormData();
    if (selectedVideo) {
      videoData.append("video", selectedVideo)
      api.product.updateVideo(videoData, (updateData as any).id)
    }

  }
  const handeUpdateImg = async () => {
    if (imagesToChange.length == 6) {
      message.warning('Nothing change!')
      return
    }
    if (selectedFile == null) {
      message.warning('Vui lòng chọn đầy đủ 6 ảnh!')
      return
    }
    if (imagesToChange.length + Array.from(selectedFile).length < 6) {
      message.warning('Vui lòng chọn đầy đủ 6 ảnh!')
      return
    }

    let formData = new FormData();
    formData.append("oldImgs", JSON.stringify(imagesToChange))
    if (selectedFile) {
      const filesArray = Array.from(selectedFile); // Chuyển đổi FileList thành mảng

      filesArray.forEach((file: any) => {
        formData.append('img', file);
      });
      try {
        let res = await api.product.updateImg(formData, (updateData as any).id)
        if (res.status == 200) {
          dispatch(productAction.update(res.data.data))
          Modal.success({
            title: "Sucess!",
            content: res.data.message,
            onOk: () => {
              setDisplayChangePic(!displayChangePic)
              setDisplayPic(!displayPic)
            }
          })
        }
      } catch (err) {
        Modal.error({
          title: "Error!",
          content: err.response?.data?.message || "Lỗi hệ thống!",
          onOk: () => {

          }
        })
      }

    }
  }
  const handleFileChange = (event: React.FormEvent) => {
    const files = Array.from((event.target as any).files);
    let err = 0;
    if (files.length + imagesToChange.length > MAX_IMAGES) {
      message.warning("Chỉ được chọn tối đa 6 ảnh!")
      err += 1;
      return
    }
    files.forEach((file: any) => {
      const { type, size } = file;
      if (!type.includes("image")) {
        message.warning(`${file.name} có định dạng không thích hợp.`);
        err += 1;
        return
      }
      const image = new Image();
      image.src = URL.createObjectURL(file);

      if (size > MAX_IMAGE_SIZE) {
        message.warning(`${file.name} có dung lượng quá lớn.`);
        message.warning("Đã tải ảnh lên thất bại!");
        setSelectedFile(null)
        return
      }

      image.onload = () => {
        if (image.width < MAX_IMAGE_WIDTH || image.height < MAX_IMAGE_HEIGHT) {
          message.warning(`${file.name} có kích thước quá nhỏ.`);
          message.warning("Đã tải ảnh lên thất bại!");
          setSelectedFile(null)
          return
        }

        URL.revokeObjectURL(image.src);
      };
    });
    if (err > 0) {
      message.warning("Đã tải ảnh lên thất bại!");
      setSelectedFile(null)
      return
    }
    setSelectedFile((event.target as any).files);
    setSelectedImg(files)
    message.success("Đã tải ảnh lên thành công!");
    (event.target as any).files = null;
    // Xử lý tập tin đã chọn ở đây
  };
  const deleteOldImgs = (imgUrl: string) => {
    setImagesToChange(imagesToChange.filter(item => item.imgUrl != imgUrl))
  }
  return (
    <div className='user_info_box'>
      <div className='user_content'>
        <div className='user'>
          <div className='user_left'>
            <img src={authenStore.data.avatar.includes("img/") ? `${import.meta.env.VITE_SV_HOST}/${authenStore.data.avatar}` : authenStore.data.avatar}></img>
            <div className='content'>
              <h5>{`${authenStore.data.firstName ? authenStore.data.firstName : authenStore.data.userName} ${authenStore.data.lastName ? authenStore.data.lastName : ""}`}</h5>
              <p>Ngày tham gia: {(new Date(Number(authenStore.data?.createAt))).toLocaleString('en-GB', options)}</p>
              <button onClick={() => {
                setShowAvatar(true)
              }}>Đổi <i className="fa-regular fa-image"></i></button>
            </div>
          </div>
          <div className='user_right'>
            <button
              onClick={() => {
                setShowUserInfo(true)
              }}
            >Chỉnh sửa hồ sơ cá nhân <i className="fa-solid fa-user-pen"></i></button>
          </div>
        </div>
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
      </div>
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
                {status == 'active' || status == 'inactive' && <button
                  onClick={() => {
                    setDisplayChangePic(!displayChangePic)
                    setImagesToChange(images)
                  }}
                  className='btn btn-danger change_pic'>Thay đổi ảnh</button>}
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
            {status == 'active' || status == 'inactive' && <button onClick={() => {
              setDisplayChangeVideo(!displayChangeVideo)
            }} type='button' className='btn btn-danger change'>Change Video!</button>}
          </div>
        </div>
      }
      {
        displayChangeVideo && <div className='product_describe_form'>
          <div className='carousel_box'>
            <button onClick={() => {
              setDisplayChangeVideo(!displayChangeVideo)
              if (videoRef.current) {
                videoRef.current.value = null;
                setSelectedVideo(null)
              }
            }} type='button' className='btn btn-danger close'>X</button>
            <div className='carousel_app'>

              <div className='video_box' style={{ cursor: "pointer", backgroundColor: "white", ...(selectedVideo ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) }} onClick={() => { handleVideo() }}>
                <input type='file' ref={videoRef} className='video_input' style={{ display: "none" }} onChange={(e) => { handleVideoChange(e) }} />

                {
                  selectedVideo && <video src={URL.createObjectURL(selectedVideo)}></video>
                }
                <i className={selectedVideo ? `fa-solid fa-check` : "fa-solid fa-clapperboard"} style={selectedVideo ? { color: "#49CC90" } : { color: "black" }}></i>
                <p style={selectedVideo ? { color: "#49CC90" } : { color: "black" }}>Đăng tối đa 1 video, Click vào đây để tải video lên!</p>
              </div>

            </div>
            <button onClick={() => {
              setDisplayChangeVideo(!displayChangeVideo)
              handeUpdateVideo()
            }} type='button' className='btn btn-danger change'>Save Video!</button>
          </div>
        </div>
      }
      {
        displayChangePic && <div className='product_describe_form'>
          <div className='carousel_box'>
            <button onClick={() => {
              setDisplayChangePic(!displayChangePic)
              if (videoRef.current) {
                inputRef.current.value = null;
                setImagesToChange(null)
              }
            }} type='button' className='btn btn-danger close_pic_update'>X</button>
            <div className='carousel_app'>
              <div className='img_box' style={{ cursor: "pointer", backgroundColor: "white", ...(selectedVideo ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) }} >
                <input type='file' ref={inputRef} className='img_input' style={{ display: "none" }} multiple onChange={(e) => { handleFileChange(e) }} />
                <i className={selectedFile ? `fa-solid fa-check` : "fa-solid fa-image"} style={selectedFile ? { color: "#49CC90" } : { color: "black" }}></i>
                <p style={selectedFile ? { color: "#49CC90" } : { color: "black" }}>Hình ảnh phải có kích thước tối thiểu 240 x 240 pixel! (Tối đa 6 ảnh)</p>
                <button className='add_pic' onClick={() => { handlePic() }}>Thêm ảnh</button>
                <div className='img_content'>

                  {imagesToChange.map(img => {
                    return <div className='img'>
                      <img className='show_all_pic' src={`${import.meta.env.VITE_SV_HOST}/${img.imgUrl}`}></img>
                      <button onClick={() => {
                        deleteOldImgs(img.imgUrl)
                      }} type='button' className='btn btn-danger del_img'>✕</button>
                    </div>
                  })
                  }
                  {
                    selectedFile && selectedImg.map(img => {
                      return <div className='img'>
                        <img src={URL.createObjectURL(img)}></img>
                        <button onClick={() => {
                          setSelectedFile(null)
                        }} type='button' className='btn btn-danger del_img'>✕</button>
                      </div>
                    })
                  }
                </div>
              </div>


            </div>
            <button onClick={() => {
              Modal.confirm({
                title: "Confirm",
                content: "Are you sure to change images?",
                onOk: () => {
                  handeUpdateImg()
                },
                onCancel: () => {

                }
              }
              )

            }} type='button' className='btn btn-danger change_pic_update'>Save Images!</button>
          </div>
        </div>
      }
      {
        showAvatar && <UserAvatar setShowAvatar={setShowAvatar} />
      }
      {
        showUserInfo && <UserInfo setShowUserInfo={setShowUserInfo} />
      }
      {
        showEditProduct && <EditProduct showEditProduct={showEditProduct} setShowEditProduct={setShowEditProduct} updateData={updateData} />
      }

      {status == 'active' && <>
        <h4>Sản phẩm đã được duyệt của bạn</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
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
                        {product.priorityStatus != 'active' && <button
                          onClick={async () => {
                            Modal.confirm({
                              title: "Confirm!",
                              content: "Are you sure you want to prioritize this product?",
                              onOk: async () => {
                                try {
                                  let result = await api.user.payment(authenStore.data?.id, { amount: 15000 })
                                  if (result.status == 200) {
                                    localStorage.setItem('token', result.data.token)
                                    dispatch(authenAction.setData(result.data.data))
                                    let res = await api.product.update(product.id, { priorityStatus: "active" })
                                    if (res.status == 200) {
                                      dispatch(productAction.update(res.data.data))
                                      message.success(`${result.data.message}`)
                                    }
                                  }
                                } catch (err) {
                                  console.log(err);

                                  message.error(`${err.response?.data?.message || "System Err"}`)
                                }

                              },
                              onCancel: () => {

                              }

                            })

                          }}
                          className='priority_logo_vip_up'>
                          <i className="fa-regular fa-circle-up"></i>
                          <span>UP</span>
                        </button>}
                        <button
                          onClick={() => {
                            // setShowEdit(!showEdit);
                            // setupdateData({ product })
                            Modal.confirm({
                              title: "Success",
                              content: `Bạn đã hoàn thành giao dịch xong và muốn tắt hiển thị tin này?`,
                              onOk: async () => {
                                try {
                                  let result = await api.product.update(product.id, { status: "done" })
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
                          className='btn btn-success' style={{ marginRight: 5 }}>
                          Done</button>
                        {/* Đẩy tin */}
                        <button
                          onClick={() => {
                            // setShowEdit(!showEdit);
                            // setupdateData({ product })
                            Modal.confirm({
                              title: "Success",
                              content: `Bạn muốn đẩy tin này (cập nhật lại thời gian đăng tin)?`,
                              onOk: async () => {
                                try {
                                  let result = await api.product.pushProduct(product.id)

                                  if (result.status == 200) {
                                    dispatch(productAction.update(result.data.data.product))
                                    dispatch(authenAction.setData(result.data.data.user))
                                    localStorage.setItem('token', result.data.data.token)
                                    message.success(`${result.data.message}`)
                                  }
                                } catch (err) {
                                  console.log('err', err);
                                }
                              },
                              onCancel: () => { }

                            })
                          }}
                          className='btn btn-warning' style={{ marginRight: 5 }}>
                          Push</button>
                        <button
                          onClick={() => {
                            setShowEditProduct(!showEditProduct);
                            setupdateData(product)
                          }}
                          style={{ marginRight: 5 }}
                          className='btn btn-info'>Edit</button>
                        {
                          <button
                            onClick={() => {
                              Modal.confirm({
                                title: "Warning",
                                content: `Are you sure you want to block this product?`,
                                onOk: async () => {
                                  try {
                                    let result = await api.product.update(product.id, { status: 'delete' })
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
                          >Block</button>
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
        <h4>Sản phẩm đang chờ duyệt của bạn</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
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
                        {product.priorityStatus != 'active' && <button
                          onClick={async () => {
                            Modal.confirm({
                              title: "Confirm!",
                              content: "Are you sure you want to prioritize this product?",
                              onOk: async () => {
                                try {
                                  let result = await api.user.payment(authenStore.data?.id, { amount: 15000 })
                                  if (result.status == 200) {
                                    localStorage.setItem('token', result.data.token)
                                    dispatch(authenAction.setData(result.data.data))
                                    let res = await api.product.update(product.id, { priorityStatus: "active", priorityTimeLine: String(Date.now()) })
                                    if (res.status == 200) {
                                      dispatch(productAction.update(res.data.data))
                                      message.success(`${result.data.message}`)
                                    }
                                  }
                                } catch (err) {
                                  console.log(err);

                                  message.error(`${err.response?.data?.message || "System Err"}`)
                                }

                              },
                              onCancel: () => {

                              }

                            })

                          }}
                          className='priority_logo_vip_up'>
                          <i className="fa-regular fa-circle-up"></i>
                          <span>UP</span>
                        </button>}
                        <button
                          onClick={() => {
                            setShowEditProduct(!showEditProduct);
                            setupdateData(product)
                          }}
                          style={{ marginRight: 5 }}
                          className='btn btn-info'>Edit</button>
                        {
                          <button
                            onClick={() => {
                              Modal.confirm({
                                title: "Warning",
                                content: `Are you sure you want to block this product?`,
                                onOk: async () => {
                                  try {
                                    let result = await api.product.update(product.id, { status: 'delete' })
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
                          >Block</button>
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
        <h4>Sản phẩm đã được bán của bạn</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
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

            </tr>
          </thead>
          <tbody>
            {
              productStore.product.length != 0 ? productStore.product?.map((product) => {
                if (product.status == "deny" && product.moderationStatus == "inactive") {
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
                        {
                          <button
                            onClick={() => {
                              Modal.confirm({
                                title: "Warning",
                                content: `Are you sure you want to unblock this product?`,
                                onOk: async () => {
                                  try {
                                    let result = await api.product.update(product.id, { status: 'inactive' })
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
                          >UnBlock</button>
                        }
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