import { api } from '@/services/apis';
import { Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import locationData from "../../../../../../../location.json"
import { productAction } from '@/stores/slices/product.slice';
export default function UserInfo({ showEditProduct, setShowEditProduct, updateData }: {
    showEditProduct: boolean,
    setShowEditProduct: any,
    updateData: any
}) {
    const dispatch = useDispatch();
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    useEffect(() => {
        setCities(locationData);
        const defaultCity = locationData.find(city => city.Name === updateData.address.split("&&")[4]);

        if (defaultCity) {
            setSelectedCity(defaultCity.Name);
            setDistricts(defaultCity.Districts);
            const defaultDistrict = defaultCity.Districts.find(district => district.Name === updateData.address.split("&&")[3]);

            if (defaultDistrict) {
                setSelectedDistrict(defaultDistrict.Name);

                const defaultWard = defaultDistrict.Wards.find(ward => ward.Name === updateData.address.split("&&")[2]);

                if (defaultWard) {
                    setSelectedWard(defaultWard.Level);
                    setWards(defaultDistrict.Wards);
                }
            }
        }
    }, [])
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!(e.target as any).ward.value || !(e.target as any).street.value || !(e.target as any).houseId.value || !(e.target as any).name.value || !(e.target as any).price.value) {
            message.warning("Vui lòng nhập đầy đủ thông tin!")
            return
        }
        let address = `${(e.target as any).houseId.value}&&${(e.target as any).street.value}&&${(e.target as any).ward.value}&&${selectedDistrict}&&${selectedCity}`
        if ((e.target as any).name.value == updateData.name &&
            Number((e.target as any).price.value) == updateData.price &&
            address == updateData.address) {
            Modal.error({
                title: "Lỗi!",
                content: "Nothing change!",
                onOk: () => {

                }
            });
            return
        }
        let data = {
            name: (e.target as any).name.value != updateData.name ? (e.target as any).name.value : updateData.name,
            price: Number((e.target as any).price.value) != updateData.name ? Number((e.target as any).price.value) : updateData.price,
            address: address != updateData.address ? address : updateData.address
        }
        console.log('updateData', updateData);
        console.log('data', data);

        let result = await api.product.update(updateData.id, { ...data })
        if (result.status == 200) {
            dispatch(productAction.update(result.data.data));
            Modal.success({
                title: "Thành công!",
                content: result.data.message,
                onOk: () => {
                    setShowEditProduct(!showEditProduct)
                },
                onCancel: () => {
                    setShowEditProduct(!showEditProduct)
                }
            })
        }
    };
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

    return (
        <div className='product_describe_form'>
            <div className='info_container_product'>
                <p onClick={() => {
                    setShowEditProduct(!showEditProduct)
                }}>✕</p>
                <h2>Product Information</h2>
                <form onSubmit={(e) => { handleSubmit(e) }} className="user-form">

                    <div className="form-group">
                        <label htmlFor="name">Product Name:</label>
                        <input type="text" id="name" defaultValue={updateData.name} placeholder="Product name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price:</label>
                        <input type="number" id="price" defaultValue={updateData.price} placeholder="Product price" required />
                    </div>


                    <div className='address'>
                        <h5>Địa chỉ</h5>
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

                        <select className="form-select form-select-sm" id="ward" value={selectedWard}>
                            <option value="" disabled>Chọn phường xã</option>
                            {wards.map(ward => (
                                <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
                            ))}
                        </select>


                    </div>
                    <div className="form-group">
                        <label htmlFor="street">Tên đường, khu phố, tổ, ấp:</label>
                        <input type="text" id="street" defaultValue={updateData.address.split("&&")[1]} placeholder='Nhập thông tin...' required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="houseId">Số nhà:</label>
                        <input type="text" id="houseId" defaultValue={updateData.address.split("&&")[0]} placeholder='Nhập thông tin...' required />
                    </div>


                </form>

            </div>

        </div>
    )
}
