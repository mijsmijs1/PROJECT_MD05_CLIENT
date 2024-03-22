import { api } from '@/services/apis';
import { Store } from '@/stores';
import { authenAction } from '@/stores/slices/authen.slice';
import { Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function UserAvatar({ setShowAvatar }: {
    setShowAvatar: any
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImg, setSelectedImg] = useState(null);
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const authenStore = useSelector((store: Store) => store.authenStore)
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 megabytes
    const MAX_IMAGE_WIDTH = 50;
    const MAX_IMAGE_HEIGHT = 50;

    const handlePic = () => {
        inputRef.current.click();
    };

    const handleFileChange = (event: React.FormEvent) => {
        const file = (event.target as any).files[0];
        const { type, size } = file;

        if (!type.includes("image")) {
            message.warning(`${file.name} có định dạng không thích hợp.`);
            return;
        }

        const image = new Image();
        image.src = URL.createObjectURL(file);

        if (size > MAX_IMAGE_SIZE) {
            message.warning(`${file.name} có dung lượng quá lớn.`);
            return;
        }

        image.onload = () => {
            if (image.width < MAX_IMAGE_WIDTH || image.height < MAX_IMAGE_HEIGHT) {
                message.warning(`${file.name} có kích thước quá nhỏ.`);
                return;
            }
            setSelectedFile(file);
            setSelectedImg(URL.createObjectURL(file));
            message.success("Đã tải ảnh lên thành công!");
            URL.revokeObjectURL(image.src);
        };
    };
    const handleChangeAvatar = async () => {
        let formData = new FormData();
        if (!selectedFile) {
            message.warning(`Vui lòng chọn hình ảnh!`);
            return;
        }
        formData.append('img', selectedFile);
        try {
            let result = await api.user.updateAvatar(authenStore.data.id, formData)
            console.log('result', result);

            if (result.status == 200) {
                dispatch(authenAction.setData(result.data.data));
                localStorage.setItem('token', result.data.token)
                Modal.success({
                    title: "Thành công!",
                    content: result.data.message,
                    onOk: () => {
                        window.location.href = `/user_info?user=${authenStore.data?.id}`
                    },
                    onCancel: () => {
                    }
                })

            }
        } catch (err) {
            console.log(err);

            Modal.error({
                title: "Thất bại",
                content: err.response.data.message,
                onOk: () => {
                    return
                },
                onCancel: () => {
                    return
                }
            })
        }




    }
    return (
        <div className='product_describe_form'>
            <div className='avatar'>
                <p onClick={() => {
                    setShowAvatar(false)
                }}>✕</p>
                <h5>Thay đổi ảnh đại diện của bạn!</h5>
                <input type='file' ref={inputRef} className='img_input' style={{ display: "none" }} onChange={(e) => { handleFileChange(e) }} />
                <img src={selectedImg ? selectedImg : (authenStore.data.avatar.includes("img/") ? `${import.meta.env.VITE_SV_HOST}/${authenStore.data.avatar}` : authenStore.data.avatar)} alt="Selected Image"></img>
                <i className={selectedFile ? `fa-solid fa-check` : "fa-solid fa-image"} style={selectedFile ? { color: "#49CC90" } : { color: "black" }}></i>
                <span style={selectedFile ? { color: "#49CC90" } : { color: "black" }}>Hình ảnh phải có kích thước tối thiểu 50 x 50 pixel!</span>
                <button onClick={() => { handlePic() }}>Chọn ảnh</button>
                <button onClick={() => { handleChangeAvatar() }}>Lưu ảnh đại diện</button>
            </div>
        </div>
    )
}