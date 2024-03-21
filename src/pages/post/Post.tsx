import React, { useEffect, useRef, useState } from 'react'
import './post.scss'
import { useDispatch, useSelector } from 'react-redux';
import { Modal, message } from 'antd';
import { convertToVND } from '@mieuteacher/meomeojs';
import locationData from "../../../location.json"
import { Store } from '@/stores';
import { api } from '@/services/apis';
import { authenAction } from '@/stores/slices/authen.slice';

export default function Post() {

  const authenStore = useSelector((store: Store) => store.authenStore)

  const MAX_IMAGES = 6;
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 megabytes
  const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 megabytes
  const MAX_IMAGE_WIDTH = 240;
  const MAX_IMAGE_HEIGHT = 240;
  const inputRef = useRef(null)
  const videoRef = useRef(null)
  const [displayForm, setDisplayForm] = useState(false);
  const [displayAddress, setDisplayAddress] = useState(false);
  const [displayPhone, setDisplayPhone] = useState(false);
  const dispatch = useDispatch();
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  const [displayCategory, setDisplayCategory] = useState(true);
  const [displayBranch, setDisplayBranch] = useState(false);
  const [category, setCategory] = useState(null);
  const [branch, setBranch] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [priority, setPrioriry] = useState(false);
  const [displayPrioriry, setDisplayPrioriry] = useState(false);


  useEffect(() => {
    setCities(locationData);
    if (!authenStore.data) {
      Modal.warning({
        title: "Warning!",
        content: "Bạn chưa đăng nhập, vui lòng đăng nhập để thực hiện đăng tin!",
        onOk: () => {
          window.location.href = "/"
        },
        onCancel: () => {
          window.location.href = "/"
        }
      })

    }
    if (!authenStore.data.phoneNumber) {
      setDisplayPhone(true)
    }
  }, []);
  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;
    const selectedCity = cities.find(city => city.Name === selectedCityName);

    if (selectedCity) {
      setSelectedCity(selectedCityName);
      setDistricts(selectedCity.Districts);
      setSelectedDistrict('');
      setWards([]);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    const selectedDistrict = districts.find(district => district.Name === selectedDistrictName);

    if (selectedDistrict) {
      setSelectedDistrict(selectedDistrictName);
      setWards(selectedDistrict.Wards);
    }
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(e.target as any).ward.value || !(e.target as any).street.value || !(e.target as any).houseId.value) {
      message.warning("Vui lòng nhập đầy đủ thông tin!")
      return
    }
    setAddress(`${(e.target as any).houseId.value}&&${(e.target as any).street.value}&&${(e.target as any).ward.value}&&${selectedDistrict}&&${selectedCity}`)
    console.log(address);
    setDisplayAddress(false)
  }

  const handlePic = () => {
    inputRef.current.click();
  }
  const handleVideo = () => {
    videoRef.current.click();
  }

  const handleFileChange = (event: React.FormEvent) => {
    const files = Array.from((event.target as any).files);
    let err = 0;
    if (files.length > MAX_IMAGES) {
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

  const handleSubmitForrm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!(e.target as any).house_name.value ||
      !address ||
      !(e.target as any).type.value ||
      !(e.target as any).price.value ||
      !(e.target as any).Tang.value ||
      !(e.target as any).Bedroom.value ||
      !(e.target as any).Badroom.value ||
      !(e.target as any).per.value ||
      !(e.target as any).deco.value ||
      !(e.target as any).more.value ||
      !(e.target as any).area.value ||
      !(e.target as any).useArea.value ||
      !(e.target as any).x.value ||
      !(e.target as any).y.value ||
      !(e.target as any).title.value ||
      !(e.target as any).des.value) {
      message.warning("Vui lòng nhập đầy đủ các trường được yêu cầu!")
      return
    }
    if ((e.target as any).title.value.length > 70) {
      message.warning("Tên của tin dài quá 70 kí tự!")
      return
    }
    if ((e.target as any).des.value.length > 1500) {
      message.warning("Miêu tả dài quá 1500 kí tự!")
      return
    }
    if (!selectedFile) {
      message.warning("Vui lòng chọn ít nhất một hình ảnh cho tin của bạn!")
      return
    }
    let formData = new FormData();
    let data = {
      name: (e.target as any).title.value,
      price: Number((e.target as any).price.value),
      desc: (e.target as any).des.value,
      address: address,
      detail: JSON.stringify({
        name: (e.target as any).house_name.value,
        type: (e.target as any).type.value,
        floor: (e.target as any).Tang.value,
        bedRoom: (e.target as any).Bedroom.value,
        badRoom: (e.target as any).Badroom.value,
        papers: (e.target as any).per.value,
        decoration: (e.target as any).deco.value,
        moreInfo: (e.target as any).more.value,
        area: (e.target as any).area.value,
        useArea: (e.target as any).useArea.value,
        xSide: (e.target as any).x.value,
        ySide: (e.target as any).y.value,
        title: (e.target as any).title.value,
        desc: (e.target as any).des.value
      }),
      branchId: branch.id,
      priorityStatus: priority ? "active" : "inactive",
      userName: authenStore.data.userName,
      userAvatar: authenStore.data.avatar
    }
    if (data.priorityStatus == 'active') {
      (data as any).priorityTimeLine = String(Date.now())
    }
    formData.append("data", JSON.stringify(data))
    const filesArray = Array.from(selectedFile); // Chuyển đổi FileList thành mảng

    filesArray.forEach((file: any) => {
      formData.append('img', file);
    });
    let result = await api.product.createProduct(formData);
    if (result.status == 200) {
      let videoData = new FormData();
      if (selectedVideo) {
        videoData.append("video", selectedVideo)
        api.product.updateVideo(videoData, result.data.data.id)
      }
      if (priority) {
        let result = await api.user.update(authenStore.data?.id, { wallet: authenStore.data?.wallet - 15000 })
        if (result.status == 200) {
          localStorage.setItem('token', result.data.token)
          dispatch(authenAction.setData(result.data.data))
        }
      }
      Modal.success({
        title: "Thành công!",
        content: "Bạn đã đăng thành công tin, nhấn Xem tin để đến trang tin của bạn!",
        onOk: () => {
          window.location.href = `/user_info?user=${authenStore.data?.id}`
        },
        onCancel: () => {
        }
      })

    }



  }
  const handleSubmitForrmLand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!(e.target as any).land_name.value ||
      !address ||
      !(e.target as any).type.value ||
      !(e.target as any).price.value ||
      !(e.target as any).areaName.value ||
      !(e.target as any).landNum.value ||
      !(e.target as any).direction.value ||
      !(e.target as any).per.value ||
      !(e.target as any).unit.value ||
      !(e.target as any).more.value ||
      !(e.target as any).area.value ||
      !(e.target as any).x.value ||
      !(e.target as any).y.value ||
      !(e.target as any).title.value ||
      !(e.target as any).des.value) {
      message.warning("Vui lòng nhập đầy đủ các trường được yêu cầu!")
      return
    }
    if ((e.target as any).title.value.length > 70) {
      message.warning("Tên của tin dài quá 70 kí tự!")
      return
    }
    if ((e.target as any).des.value.length > 1500) {
      message.warning("Miêu tả dài quá 1500 kí tự!")
      return
    }
    if (!selectedFile) {
      message.warning("Vui lòng chọn ít nhất một hình ảnh cho tin của bạn!")
      return
    }
    let formData = new FormData();
    let data = {
      name: (e.target as any).title.value,
      price: Number((e.target as any).price.value),
      desc: (e.target as any).des.value,
      address: address,
      detail: JSON.stringify({
        name: (e.target as any).land_name.value,
        type: (e.target as any).type.value,
        areaName: (e.target as any).areaName.value,
        landNum: (e.target as any).landNum.value,
        papers: (e.target as any).per.value,
        direction: (e.target as any).direction.value,
        moreInfo: (e.target as any).more.value,
        area: (e.target as any).area.value,
        unit: (e.target as any).unit.value,
        xSide: (e.target as any).x.value,
        ySide: (e.target as any).y.value,
        title: (e.target as any).title.value,
        desc: (e.target as any).des.value
      }),
      branchId: branch.id,
      priorityStatus: priority ? "active" : "inactive",
      userName: authenStore.data.userName,
      userAvatar: authenStore.data.avatar
    }
    if (data.priorityStatus == 'active') {
      (data as any).priorityTimeLine = String(Date.now())
    }
    formData.append("data", JSON.stringify(data))
    const filesArray = Array.from(selectedFile); // Chuyển đổi FileList thành mảng

    filesArray.forEach((file: any) => {
      formData.append('img', file);
    });
    let result = await api.product.createProduct(formData);
    if (result.status == 200) {
      let videoData = new FormData();
      if (selectedVideo) {
        videoData.append("video", selectedVideo)
        api.product.updateVideo(videoData, result.data.data.id)
      }
      if (priority) {
        let result = await api.user.update(authenStore.data?.id, { wallet: authenStore.data?.wallet - 15000 })
        if (result.status == 200) {
          localStorage.setItem('token', result.data.token)
          dispatch(authenAction.setData(result.data.data))
        }
      }
      if (priority) {
        let result = await api.user.update(authenStore.data?.id, { wallet: authenStore.data?.wallet - 15000 })
        if (result.status == 200) {
          localStorage.setItem('token', result.data.token)
          dispatch(authenAction.setData(result.data.data))
        }
      }
      Modal.success({
        title: "Thành công!",
        content: "Bạn đã đăng thành công tin, nhấn Xem tin để đến trang tin của bạn!",
        onOk: () => {
          window.location.href = `/user_info?user=${authenStore.data?.id}`
        },
        onCancel: () => {
        }
      })

    }



  }
  const handleSubmitFormMoto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !(e.target as any).motoName.value ||
      !address ||
      !(e.target as any).type.value ||
      !(e.target as any).price.value ||
      !(e.target as any).use.value ||
      !(e.target as any).year.value ||
      !(e.target as any).branch.value ||
      !(e.target as any).cc.value ||
      !(e.target as any).id.value ||
      !(e.target as any).from.value ||
      !(e.target as any).km.value ||
      !(e.target as any).title.value ||
      !(e.target as any).des.value ||
      !(e.target as any).des.value) {
      message.warning("Vui lòng nhập đầy đủ các trường được yêu cầu!")
      return
    }
    if ((e.target as any).title.value.length > 70) {
      message.warning("Tên của tin dài quá 70 kí tự!")
      return
    }
    if ((e.target as any).des.value.length > 1500) {
      message.warning("Miêu tả dài quá 1500 kí tự!")
      return
    }
    if (!selectedFile) {
      message.warning("Vui lòng chọn ít nhất một hình ảnh cho tin của bạn!")
      return
    }
    let formData = new FormData();
    let data = {
      name: (e.target as any).title.value,
      price: Number((e.target as any).price.value),
      desc: (e.target as any).des.value,
      address: address,
      detail: JSON.stringify({
        name: (e.target as any).motoName.value,
        type: (e.target as any).type.value,
        used: (e.target as any).use.value,
        RegisteredAt: (e.target as any).year.value,
        branch: (e.target as any).branch.value,
        cc: (e.target as any).cc.value,
        motoId: (e.target as any).id.value,
        km: (e.target as any).km.value,
        from: (e.target as any).from.value,
        title: (e.target as any).title.value,
        desc: (e.target as any).des.value
      }),
      branchId: branch.id,
      priorityStatus: priority ? "active" : "inactive",
      userName: authenStore.data.userName,
      userAvatar: authenStore.data.avatar
    }
    if (data.priorityStatus == 'active') {
      (data as any).priorityTimeLine = String(Date.now())
    }
    formData.append("data", JSON.stringify(data))
    const filesArray = Array.from(selectedFile); // Chuyển đổi FileList thành mảng

    filesArray.forEach((file: any) => {
      formData.append('img', file);
    });

    let result = await api.product.createProduct(formData);
    if (result.status == 200) {
      let videoData = new FormData();
      if (selectedVideo) {
        videoData.append("video", selectedVideo)
        api.product.updateVideo(videoData, result.data.data.id)
      }
      if (priority) {
        let result = await api.user.update(authenStore.data?.id, { wallet: authenStore.data?.wallet - 15000 })
        if (result.status == 200) {
          localStorage.setItem('token', result.data.token)
          dispatch(authenAction.setData(result.data.data))
        }
      }
      Modal.success({
        title: "Thành công!",
        content: "Bạn đã đăng thành công tin, nhấn Xem tin để đến trang tin của bạn!",
        onOk: () => {
          window.location.href = `/user_info?user=${authenStore.data?.id}`
        },
        onCancel: () => {
        }
      })

    }
  }

  const handleSubmitFormPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !(e.target as any).phoneName.value ||
      !address ||
      !(e.target as any).use.value ||
      !(e.target as any).price.value ||
      !(e.target as any).branch.value ||
      !(e.target as any).color.value ||
      !(e.target as any).ram.value ||
      !(e.target as any).BH.value ||
      !(e.target as any).from.value ||
      !(e.target as any).title.value ||
      !(e.target as any).des.value ||
      !(e.target as any).des.value) {
      message.warning("Vui lòng nhập đầy đủ các trường được yêu cầu!")
      return
    }
    if ((e.target as any).title.value.length > 70) {
      message.warning("Tên của tin dài quá 70 kí tự!")
      return
    }
    if ((e.target as any).des.value.length > 1500) {
      message.warning("Miêu tả dài quá 1500 kí tự!")
      return
    }
    if (!selectedFile) {
      message.warning("Vui lòng chọn ít nhất một hình ảnh cho tin của bạn!")
      return
    }
    let formData = new FormData();
    let data = {
      name: (e.target as any).title.value,
      price: Number((e.target as any).price.value),
      desc: (e.target as any).des.value,
      address: address,
      detail: JSON.stringify({
        name: (e.target as any).phoneName.value,
        used: (e.target as any).use.value,
        branch: (e.target as any).branch.value,
        color: (e.target as any).color.value,
        ram: (e.target as any).ram.value,
        guarantee: (e.target as any).BH.value,
        from: (e.target as any).from.value,
        title: (e.target as any).title.value,
        desc: (e.target as any).des.value
      }),
      branchId: branch.id,
      priorityStatus: priority ? "active" : "inactive",
      userName: authenStore.data.userName,
      userAvatar: authenStore.data.avatar
    }
    if (data.priorityStatus == 'active') {
      (data as any).priorityTimeLine = String(Date.now())
    }
    formData.append("data", JSON.stringify(data))
    const filesArray = Array.from(selectedFile); // Chuyển đổi FileList thành mảng

    filesArray.forEach((file: any) => {
      formData.append('img', file);
    });
    let result = await api.product.createProduct(formData);
    if (result.status == 200) {
      let videoData = new FormData();
      if (selectedVideo) {
        videoData.append("video", selectedVideo)
        api.product.updateVideo(videoData, result.data.data.id)
      }
      if (priority) {
        let result = await api.user.update(authenStore.data?.id, { wallet: authenStore.data?.wallet - 15000 })
        if (result.status == 200) {
          localStorage.setItem('token', result.data.token)
          dispatch(authenAction.setData(result.data.data))
        }
      }
      Modal.success({
        title: "Thành công!",
        content: "Bạn đã đăng thành công tin, nhấn Xem tin để đến trang tin của bạn!",
        onOk: () => {
          window.location.href = `/user_info?user=${authenStore.data?.id}`
        },
        onCancel: () => {
        }
      })

    }


  }
  return (
    <div className='post_box'>
      <h1>Đăng tin - đưa sản phẩm của bạn đến với mọi người</h1>
      <div className='post_app'>

        <div className='img_video'>
          <h4>Hình ảnh và video sản phẩm: </h4>
          <div className='img_box' style={branch ? { cursor: "pointer", ...(selectedFile ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) } : { cursor: "not-allowed", ...(selectedFile ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) }} onClick={() => { handlePic() }}>
            {branch && <input type='file' ref={inputRef} className='img_input' style={{ display: "none" }} multiple onChange={(e) => { handleFileChange(e) }} />}
            <i className={selectedFile ? `fa-solid fa-check` : "fa-solid fa-image"} style={selectedFile ? { color: "#49CC90" } : { color: "black" }}></i>
            <p style={selectedFile ? { color: "#49CC90" } : { color: "black" }}>Hình ảnh phải có kích thước tối thiểu 240 x 240 pixel! (Tối đa 6 ảnh)</p>
            {
              selectedFile && selectedImg.map(img => {
                return <img src={URL.createObjectURL(img)}></img>
              })
            }

          </div>
          <div className='img_box' style={branch ? { cursor: "pointer", ...(selectedVideo ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) } : { cursor: "not-allowed", ...(selectedVideo ? { border: "2px dashed #49CC90" } : { border: "2px dashed rgb(255,99,47)" }) }} onClick={() => { handleVideo() }}>
            {branch && <input type='file' ref={videoRef} className='video_input' style={{ display: "none" }} onChange={(e) => { handleVideoChange(e) }} />}
            <i className={selectedVideo ? `fa-solid fa-check` : "fa-solid fa-clapperboard"} style={selectedVideo ? { color: "#49CC90" } : { color: "black" }}></i>
            <p style={selectedVideo ? { color: "#49CC90" } : { color: "black" }}>Đăng tối đa 1 video</p>
            {
              selectedVideo && <video src={URL.createObjectURL(selectedVideo)}></video>
            }

          </div>
        </div>
        <div className='content'>
          <h4>Thông tin sản phẩm: </h4>


          <button className='category_btn' style={branch ? { backgroundColor: "#49CC90", color: "rgb(255,99,47)", border: "none" } : { backgroundColor: "white" }} onClick={() => {
            setDisplayForm(!displayForm)
          }}><span>{branch ? `${category.name} - ${branch.name} ` : `Danh mục -  sản phẩm `}</span><span style={{ color: "red" }}>(*)</span> <i className="fa-solid fa-plus"></i></button>
          {!branch && <>
            <img src='https://static.chotot.com/storage/chotot-icons/svg/empty-category.svg'></img>
            <p>Đăng nhanh - bán gọn - giao dịch nhanh chóng an toàn và tiện lợi tại RaoVat!</p>
          </>
          }
          {
            branch && <>
              {branch.codeName == "house" && <form className='form_info' onSubmit={(e) => {
                handleSubmitForrm(e)
              }}>
                <p>Thông tin chi tiết</p>
                <div className='priority'>
                  <span>Bạn có muốn mua ưu tiên cho tin này không?</span>
                  <input type="checkbox" name="priority" value="true" onChange={() => {
                    setDisplayPrioriry(true);
                  }}
                    checked={priority}
                  ></input>
                </div>

                <p>Địa chỉ BĐS và hình ảnh</p>
                <input type='text' placeholder='Tên tòa nhà/ khu dân cư/ dự án' id="house_name" required></input>
                <button className='address' onClick={() => {
                  setDisplayAddress(true)
                }}><span>{address ? `${address.replace(/&&/g, " ")} ` : `Chọn địa chỉ BĐS`}</span><span style={{ color: "red" }}>(*)</span> <i className="fa-solid fa-plus"></i></button>
                <p>Thông tin chi tiết:</p>
                <h6>Loại hình nhà ở: </h6>
                <select id="type" defaultValue="">
                  <option value="" disabled>Loại hình nhà ở <span style={{ color: "red" }}>(*)</span></option>
                  <option value="Nhà mặt phố, mặt tiền">Nhà mặt phố, mặt tiền</option>
                  <option value="Nhà ngõ, hẻm">Nhà ngõ, hẻm</option>
                  <option value="Nhà biệt thự">Nhà biệt thự</option>
                </select>
                <h6>Tổng số tầng: </h6>
                <select id="Tang" defaultValue="">
                  <option value="" disabled>Tổng số tầng<span style={{ color: "red" }}>(*)</span></option>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Nhiều hơn 10"].map(item => {
                      return <>
                        <option value={item}>{item}</option>
                      </>
                    })
                  }
                </select>
                <h6>Số phòng ngủ: </h6>
                <select id="Bedroom" defaultValue="">
                  <option value="" disabled>Số phòng ngủ<span style={{ color: "red" }}>(*)</span></option>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Nhiều hơn 10"].map(item => {
                      return <>
                        <option value={item}>{item}</option>
                      </>
                    })
                  }
                </select>
                <h6>Số phòng vệ sinh: </h6>
                <select id="Badroom" defaultValue="">
                  <option value="" disabled>Số phòng vệ sinh<span style={{ color: "red" }}>(*)</span></option>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Nhiều hơn 10"].map(item => {
                      return <>
                        <option value={item}>{item}</option>
                      </>
                    })
                  }
                </select>
                <p>Thông tin khác:</p>
                <h6>Giấy tờ pháp lý: </h6>
                <select id="per" defaultValue="">
                  <option value="" disabled>Giấy tờ pháp lý<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Đã có sổ">Đã có sổ</option>
                  <option value="Đang chờ sổ">Đang chờ sổ</option>
                  <option value="Giấy tờ khác">Giấy tờ khác</option>
                </select>
                <h6>Tình trạng nội thất: </h6>
                <select id="deco" defaultValue="">
                  <option value="" disabled>Tình trạng nội thất<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Nội thất đầy đủ">Nội thất đầy đủ</option>
                  <option value="Hoàn thiện cơ bản">Hoàn thiện cơ bản</option>
                  <option value="Bàn giao th">Bàn giao thô</option>
                </select>
                <p>Đặc điểm nhà đất:</p>
                <select id="more" defaultValue="">
                  <option value="" disabled>Thông tin thêm:<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Hẻm xe hơi">Hẻm xe hơi</option>
                  <option value="Nở hậu">Nở hậu</option>
                  <option value="Khác">Khác</option>
                </select>
                <p>Diện tích và giá:</p>
                <h6>Diện tích đất (m²): </h6>
                <input type='text' placeholder={`Diện tích đất (m²)`} id="area" required></input>
                <h6>Diện tích sử dụng (m²): </h6>
                <input type='text' placeholder={`Diện tích sử dụng (m²)`} id="useArea" required></input>
                <h6>Chiều dài (m): </h6>
                <input type='text' placeholder={`Chiều dài (m)`} id="x" required></input>
                <h6>Chiều ngang (m): </h6>
                <input type='text' placeholder={`Chiều ngang (m)`} id="y" required></input>
                <h6>Giá bán (đồng): </h6>
                <input type='number' placeholder={`Giá bán (đồng)`} id="price" required></input>
                <p style={{ color: "rgb(255,99,47)" }}>Tiêu đề tin đăng và Mô tả chi tiết (quan trọng)!</p>
                <input type='text' placeholder={`Tiêu đề tin đăng (Tối đa 70 kí tự)`} id="title" required></input>
                <p>Mô tả chi tiết: (Tối đa 1000 kí tự)</p>
                <textarea id="des" style={{ width: "90%", height: 150 }} inputMode='text' placeholder='Nên có: Loại nhà ở, vị trí, tiện ích, diện tích, số phòng, thông tin pháp lý, nội thất, v.v.

Ví dụ: Nhà mặt tiền số 58 Phan Chu Trinh, Q.Bình Thạnh, 120m². Khu dân cư an ninh. Giấy tờ chính chủ.'></textarea>
                <button type='submit'>Đăng tin</button>
              </form>}
              {branch.codeName == "land" && <form className='form_info' onSubmit={(e) => {
                handleSubmitForrmLand(e)
              }}>
                <p>Thông tin chi tiết</p>
                <div className='priority'>
                  <span>Bạn có muốn mua ưu tiên cho tin này không?</span>
                  <input type="checkbox" name="priority" value="true" onChange={() => {
                    setDisplayPrioriry(true);
                  }}
                    checked={priority}
                  ></input>
                </div>

                <p>Địa chỉ BĐS và hình ảnh</p>
                <input type='text' placeholder='Tên dự án/ khu đất' id="land_name" required></input>
                <button className='address' onClick={() => {
                  setDisplayAddress(true)
                }}><span>{address ? `${address.replace(/&&/g, " ")} ` : `Chọn địa chỉ BĐS`}</span><span style={{ color: "red" }}>(*)</span> <i className="fa-solid fa-plus"></i></button>
                <p>Vị trí BĐS</p>
                <h6>Tên phân khu: </h6>
                <input type='text' placeholder={`Tên phân khu`} id="areaName" required></input>
                <h6>Mã lô: </h6>
                <input type='text' placeholder={`Mã lô`} id="landNum" required></input>
                <p>Thông tin chi tiết:</p>
                <h6>Loại hình đất: </h6>
                <select id="type" defaultValue="">
                  <option value="" disabled>Loại hình đất <span style={{ color: "red" }}>(*)</span></option>
                  <option value="Đất thổ cư">Đất thổ cư</option>
                  <option value="Đất nền dự án">Đất nền dự án</option>
                  <option value="Đất công nghiệp">Đất công nghiệp</option>
                  <option value="Đất nông nghiệp">Đất nông nghiệp</option>
                </select>
                <h6>Hướng đất: </h6>
                <select id="direction" defaultValue="">
                  <option value="" disabled>Hướng đất<span style={{ color: "red" }}>(*)</span></option>
                  {
                    ["Đông", "Tây", "Nam", "Bắc", "Khác"].map(item => {
                      return <>
                        <option value={item}>{item}</option>
                      </>
                    })
                  }
                </select>

                <p>Thông tin khác:</p>
                <h6>Giấy tờ pháp lý: </h6>
                <select id="per" defaultValue="">
                  <option value="" disabled>Giấy tờ pháp lý<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Đã có sổ">Đã có sổ</option>
                  <option value="Đang chờ sổ">Đang chờ sổ</option>
                  <option value="Giấy tờ khác">Giấy tờ khác</option>
                </select>
                <p>Đặc điểm nhà đất:</p>
                <select id="more" defaultValue="">
                  <option value="" disabled>Thông tin thêm:<span style={{ color: "red" }}>(*)</span></option>
                  <option value="Hẻm xe hơi">Hẻm xe hơi</option>
                  <option value="Nở hậu">Nở hậu</option>
                  <option value="Khác">Khác</option>
                </select>
                <p>Diện tích và giá:</p>
                <h6>Diện tích đất: </h6>
                <input type='text' placeholder={`Diện tích đất`} id="area" required></input>
                <p>Đơn vị:</p>
                <select id="unit" defaultValue="">
                  <option value="" disabled>Thông tin thêm:<span style={{ color: "red" }}>(*)</span></option>
                  <option value="m2">m²</option>
                  <option value="hecta">hecta</option>
                </select>
                <h6>Chiều dài (m): </h6>
                <input type='text' placeholder={`Chiều dài (m)`} id="x" required></input>
                <h6>Chiều ngang (m): </h6>
                <input type='text' placeholder={`Chiều ngang (m)`} id="y" required></input>
                <h6>Giá bán (đồng): </h6>
                <input type='number' placeholder={`Giá bán (đồng)`} id="price" required></input>
                <p style={{ color: "rgb(255,99,47)" }}>Tiêu đề tin đăng và Mô tả chi tiết (quan trọng)!</p>
                <input type='text' placeholder={`Tiêu đề tin đăng (Tối đa 70 kí tự)`} id="title" required></input>
                <p>Mô tả chi tiết: (Tối đa 1000 kí tự)</p>
                <textarea id="des" style={{ width: "90%", height: 150 }} inputMode='text' placeholder='Nên có: Loại nhà ở, vị trí, tiện ích, diện tích, số phòng, thông tin pháp lý, nội thất, v.v.

Ví dụ: Nhà mặt tiền số 58 Phan Chu Trinh, Q.Bình Thạnh, 120m2. Khu dân cư an ninh. Giấy tờ chính chủ.'></textarea>
                <button type='submit'>Đăng tin</button>
              </form>}
              {
                branch.codeName == "motocycle" && <form className='form_info' onSubmit={(e) => {
                  handleSubmitFormMoto(e)
                }}>
                  <p>Thông tin chi tiết</p>
                  <div className='priority'>
                    <span>Bạn có muốn mua ưu tiên cho tin này không?</span>
                    <input type="checkbox" name="priority" value="true" onChange={() => {
                      setDisplayPrioriry(true);
                    }}
                      checked={priority}
                    ></input>
                  </div>
                  <h6>Tình trạng sử dụng: </h6>
                  <select id="use" defaultValue="">
                    <option value="" disabled>Tình trạng sử dụng <span style={{ color: "red" }}>(*)</span></option>
                    <option value="Mới">Mới</option>
                    <option value="Đã sử dụng">Đã sử dụng</option>
                  </select>
                  <button className='address' onClick={() => {
                    setDisplayAddress(true)
                  }}><span>{address ? `${address.replace(/&&/g, " ")} ` : `Chọn địa chỉ người bán`}</span><span style={{ color: "red" }}>(*)</span> <i className="fa-solid fa-plus"></i></button>
                  <p>Thông tin chi tiết:</p>
                  <h6>Tên xe: </h6>
                  <input type='text' placeholder={`Tên xe:`} id="motoName" required></input>
                  <h6>Hãng xe: </h6>
                  <select id="branch" defaultValue="">
                    <option value="" disabled>Hãng xe <span style={{ color: "red" }}>(*)</span></option>
                    {
                      [
                        "BMW",
                        "Ducati",
                        "Harley Davidson",
                        "Honda",
                        "Kawasaki",
                        "Suzuki",
                        "Yamaha",
                        "Piaggio",
                        "SYM",
                        "Kymco",
                        "Royal Enfield",
                        "Aprilia",
                        "Triumph",
                        "Bajaj",
                        "Benelli"
                      ].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Năm đăng kí: </h6>
                  <input type='text' placeholder={`Năm đăng kí (ví dụ: 2015)`} id="year" required></input>
                  <h6>Loại xe: </h6>
                  <select id="type" defaultValue="">
                    <option value="" disabled>Loại xe <span style={{ color: "red" }}>(*)</span></option>
                    {
                      ["Tay ga", "Xe só", "Tay côn/Moto"].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Dung tích xe (cc): </h6>
                  <select id="cc" defaultValue="">
                    <option value="" disabled>Dung tích xe<span style={{ color: "red" }}>(*)</span></option>
                    {
                      ["Dưới 50 cc", "50 - 100 cc", "100 - 175 cc", "Trên 175 cc", "Không biết rõ"].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Biển số xe: </h6>
                  <input type='text' placeholder={`Nhập biển số xe:`} id="id" required></input>
                  <h6>Xuất xứ: </h6>
                  <select id="from" defaultValue="">
                    <option value="" disabled>Xuất xứ<span style={{ color: "red" }}>(*)</span></option>
                    {
                      [
                        "Đức",
                        "Ý",
                        "Mỹ",
                        "Nhật Bản",
                        "Thái Lan",
                        "Trung Quốc",
                        "Hàn Quốc",
                        "Ý",
                        "Ấn Độ",
                        "Đài Loan"
                      ].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Số km đã đi được: </h6>
                  <input type='text' placeholder={`Nhập số km đi được: `} id="km" required></input>
                  <h6>Giá bán (đồng): </h6>
                  <input type='number' placeholder={`Giá bán (đồng): (ví dụ: 30000000) `} id="price" required></input>
                  <p style={{ color: "rgb(255,99,47)" }}>Tiêu đề tin đăng và Mô tả chi tiết (quan trọng)!</p>
                  <input type='text' placeholder={`Tiêu đề tin đăng (Tối đa 70 kí tự)`} id="title" required></input>
                  <p>Mô tả chi tiết: (Tối đa 1000 kí tự)</p>
                  <textarea id="des" style={{ width: "90%", height: 150 }} inputMode='text' placeholder='Nên có: Loại nhà ở, vị trí, tiện ích, diện tích, số phòng, thông tin pháp lý, nội thất, v.v.
  
  Ví dụ: Nhà mặt tiền số 58 Phan Chu Trinh, Q.Bình Thạnh, 120m2. Khu dân cư an ninh. Giấy tờ chính chủ.'></textarea>
                  <button type='submit'>Đăng tin</button>
                </form>
              }
              {
                branch.codeName == "phone" && <form className='form_info' onSubmit={(e) => {
                  handleSubmitFormPhone(e)
                }}>
                  <p>Thông tin chi tiết</p>
                  <div className='priority'>
                    <span>Bạn có muốn mua ưu tiên cho tin này không?</span>
                    <input type="checkbox" name="priority" value="true" onChange={() => {
                      setDisplayPrioriry(true);
                    }}
                      checked={priority}
                    ></input>
                  </div>
                  <h6>Tình trạng sử dụng: </h6>
                  <select id="use" defaultValue="">
                    <option value="" disabled>Tình trạng sử dụng <span style={{ color: "red" }}>(*)</span></option>
                    <option value="Mới">Mới</option>
                    <option value="Đã sử dụng">Đã sử dụng</option>
                  </select>
                  <button className='address' onClick={() => {
                    setDisplayAddress(true)
                  }}><span>{address ? `${address.replace(/&&/g, " ")} ` : `Chọn địa chỉ người bán`}</span><span style={{ color: "red" }}>(*)</span> <i className="fa-solid fa-plus"></i></button>
                  <p>Thông tin chi tiết:</p>
                  <h6>Tên điện thoại: </h6>
                  <input type='text' placeholder={`Tên điện thoại:`} id="phoneName" required></input>
                  <h6>Hãng điện thoại: </h6>
                  <select id="branch" defaultValue="">
                    <option value="" disabled>Hãng điện thoại <span style={{ color: "red" }}>(*)</span></option>
                    {
                      [
                        "Apple",
                        "Samsung",
                        "Xiaomi",
                        "OPPO",
                        "Vivo",
                        "Nokia",
                        "Sony",
                        "LG",
                        "Motorola",
                        "OnePlus",
                        "Google",
                        "Asus",
                        "Lenovo",
                        "Huawei",
                        "Realme",
                        "HTC",
                        "BlackBerry",
                        "Alcatel",
                        "Meizu",
                        "ZTE", "Khác"
                      ].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Màu sắc: </h6>
                  <select id="color" defaultValue="">
                    <option value="" disabled>Màu sắc <span style={{ color: "red" }}>(*)</span></option>
                    {
                      [
                        "Bạc",
                        "Đen",
                        "Đen bóng - Jet black",
                        "Đỏ",
                        "Hồng",
                        "Trắng",
                        "Vàng",
                        "Vàng hồng",
                        "Xám",
                        "Khác"
                      ].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Dung lượng: </h6>
                  <select id="ram" defaultValue="">
                    <option value="" disabled>Dung lượng <span style={{ color: "red" }}>(*)</span></option>
                    {
                      ["< 8GB", "8 GB", "16 GB", "32 GB", "64 GB", "128 GB", "256 GB", "> 256 GB"].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Chính sách bảo hành: </h6>
                  <select id="BH" defaultValue="">
                    <option value="" disabled>Chính sách bảo hành<span style={{ color: "red" }}>(*)</span></option>
                    {
                      ["Hết bảo hành", "1 tháng", "2 tháng", "3 tháng", "4-6 tháng", "7-12 tháng", ">12 tháng", "Còn bảo hành", "Không biết rõ"].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Xuất xứ: </h6>
                  <select id="from" defaultValue="">
                    <option value="" disabled>Xuất xứ<span style={{ color: "red" }}>(*)</span></option>
                    {
                      [
                        "Đức",
                        "Ý",
                        "Mỹ",
                        "Nhật Bản",
                        "Thái Lan",
                        "Trung Quốc",
                        "Hàn Quốc",
                        "Ý",
                        "Ấn Độ",
                        "Đài Loan"
                      ].map(item => {
                        return <>
                          <option value={item}>{item}</option>
                        </>
                      })
                    }
                  </select>
                  <h6>Giá bán (đồng): </h6>
                  <input type='number' placeholder={`Giá bán (đồng): (ví dụ: 30000000) `} id="price" required></input>
                  <p style={{ color: "rgb(255,99,47)" }}>Tiêu đề tin đăng và Mô tả chi tiết (quan trọng)!</p>
                  <input type='text' placeholder={`Tiêu đề tin đăng (Tối đa 70 kí tự)`} id="title" required></input>
                  <p>Mô tả chi tiết: (Tối đa 1000 kí tự)</p>
                  <textarea id="des" style={{ width: "90%", height: 150 }} inputMode='text' placeholder='Nên có: Loại nhà ở, vị trí, tiện ích, diện tích, số phòng, thông tin pháp lý, nội thất, v.v.
  
  Ví dụ: Nhà mặt tiền số 58 Phan Chu Trinh, Q.Bình Thạnh, 120m2. Khu dân cư an ninh. Giấy tờ chính chủ.'></textarea>
                  <button type='submit'>Đăng tin</button>
                </form>
              }
            </>

          }

        </div>
      </div>
      {displayForm && <div className='form_box'>
        <div className='content'>
          <h2>Đăng tin - thông tin sản phẩm</h2>
          {isReturning && <span className='return' onClick={() => {
            setDisplayBranch(false)
            setDisplayCategory(true)
            setBranch(null)
            setSelectedFile(null)
            setSelectedImg(null)
            setSelectedVideo(null)
          }
          }><i className="fa-solid fa-arrow-left"></i></span>}
          <span onClick={() => {
            setDisplayForm(!displayForm)
            setCategory(null)
            setBranch(null)
          }
          }>X</span>
          <p>CHỌN DANH MỤC:</p>
          {displayCategory &&
            categoryStore.category?.map(item => {
              return <button
                onClick={() => {
                  setCategory(item)
                  setDisplayCategory(false)
                  setDisplayBranch(true)
                  setIsReturning(true)
                }}
                key={Date.now() * Math.random()}><img src={String(item.avatar)}></img>{item.name} <i className="fa-solid fa-plus"></i></button>
            })
          }
          {
            displayBranch && categoryStore.category.map(item => {
              if (item.codeName == category.codeName) {
                return item.branches.map(branch => {
                  return <button
                    onClick={() => {
                      setBranch(branch)
                      setDisplayForm(!displayForm)
                    }}
                    key={Date.now() * Math.random()}>{branch.name} <i className="fa-solid fa-plus"></i></button>
                })

              }
            })
          }
        </div>

      </div>}
      {displayAddress && <>
        <div className='form_box'>
          <div className='content'>
            <h2>Địa chỉ</h2>
            <span onClick={() => {
              setDisplayAddress(false)
            }
            }>X</span>
            <div>
              <select className="form-select form-select-sm mb-3" onChange={handleCityChange} value={selectedCity}>
                <option value="" disabled>Chọn tỉnh thành</option>
                {cities.map(city => (
                  <option key={city.Id} value={city.Name}>{city.Name}</option>
                ))}
              </select>

              <select className="form-select form-select-sm mb-3" onChange={handleDistrictChange} value={selectedDistrict}>
                <option value="" disabled>Chọn quận huyện</option>
                {districts.map(district => (
                  <option key={district.Id} value={district.Name}>{district.Name}</option>
                ))}
              </select>
              <form onSubmit={(e) => {
                handleSubmitAddress(e)
              }} className='address_form'>
                <select className="form-select form-select-sm" id="ward" defaultValue="">
                  <option value="" disabled>Chọn phường xã</option>
                  {wards.map(ward => (
                    <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                  ))}
                </select>
                <p>Tên đường, khu phố, tổ, ấp:</p>
                <input type='text' placeholder='Nhập thông tin...' id="street"></input>
                <p>Số nhà:</p>
                <input type='text' placeholder='Nhập thông tin...' id="houseId"></input>
                <button type='submit'>Xác nhận</button>
              </form>
            </div>

          </div>

        </div>
      </>}

      {displayPrioriry && <>
        <div className='form_box'>
          <div className='content'>
            <h2 style={{ color: "rgb(255,99,47)" }} >Tin ưu tiên</h2>
            <span onClick={() => {
              setDisplayPrioriry(false)
            }
            }>X</span>
            <div>
              <h4 style={{ color: "#49CC90" }}>Tại sao nên đẩy tin ưu tiên ?</h4>
              <p>Hiển thị nhiều sản phẩm hơn đến người mua, dễ dàng tiếp cận người mua hơn, được ưu tiên trên thanh tìm kiếm, ưu tiên xét duyệt!</p>
              <p>Thanh toán một lần, tin của bạn sẽ được ưu tiên trong 7 ngày!</p>
              <p style={{ color: "#49CC90" }}>{`Giá ưu tiên cho một tin là ${convertToVND(15000)}`}</p>
              <div>
                <span style={{ position: "unset", color: "rgb(255,99,47)" }}>Số dư của bạn hiện tại: </span><span style={{ position: "unset", color: "rgb(255,99,47)" }}>{convertToVND(authenStore.data?.wallet ? authenStore.data?.wallet : 0)} <ion-icon name="cash-outline"></ion-icon></span>
              </div>
              <button onClick={() => {
                if (authenStore.data?.wallet < 15000) {
                  message.warning("Số dư trong ví của bạn không đủ để thanh toán! Vui lòng nạp thêm coin vào!");
                  setDisplayPrioriry(false);
                  (document.getElementById('priority') as any).checked = false;
                  return
                }
                setPrioriry(true);
                setDisplayPrioriry(false);
                (document.getElementById('priority') as any).checked = true;

              }}>Ưu tiên</button>
            </div>

          </div>

        </div>
      </>}

      {
        displayPhone && <div className="amount">
          <form className="subscribe" onSubmit={async (e) => {
            e.preventDefault();
            console.log(String((e.target as any).amount.value).length);

            if (String((e.target as any).amount.value).length != 10 && String((e.target as any).amount.value).length != 11) {
              message.error("Số điện thoại không hợp lệ, vui lòng nhập lại!")
              return
            }
            let result = await api.user.update(authenStore.data?.id, { phoneNumber: String((e.target as any).amount.value) })
            if (result.status == 200) {

              localStorage.setItem('token', result.data.token)
              dispatch(authenAction.setData(result.data.data))
              setDisplayPhone(false);
            } else {
              Modal.error({
                title: "Thất bại",
                content: "Cập nhật số điện thoại thất bại, vui lòng thử lại sau"
              })
              window.location.href = "/"
            }
          }}>
            <p>SỐ ĐIỆN THOẠI!</p>
            <input placeholder="Nhập số điện thoại của bạn" className="subscribe-input" name="amount" type="number" />
            <br />
            <button className="submit-btn" type="submit">ĐỒNG Ý</button>
          </form>
        </div>
      }
    </div>
  )
}
