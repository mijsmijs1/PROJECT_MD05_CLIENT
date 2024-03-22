
import { InputGroup, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { api } from '@/services/apis';
import { productAction } from '@/stores/slices/product.slice';
export default function DescribeShow({ showDes, setShowDes, updateData, setUpdateData }) {
    const dispatch = useDispatch();
    console.log(updateData);
    const handleSaveDes = async (e) => {
        e.preventDefault();

        try {
            let description = e.target.des.value;
            if (description == '' || null) {
                description = "Đang cập nhật";
                e.target.des.value = "Đang cập nhật"
                setUpdateData({ ...updateData, desc: "Đang cập nhật" })
            }
            if (e.target.des.value == updateData.detail.desc) {
                Modal.warning({
                    title: 'Warning!',
                    content: "Nothing change!",
                    onOk: () => {
                        setShowDes(!showDes)
                    }
                })
                return
            }
            let result = await api.product.update(updateData.id, { detail: JSON.stringify({ ...updateData.detail, desc: description }) })
            if (result.status == 200) {
                dispatch(productAction.update(result.data.data))
                Modal.success({
                    title: 'Success!',
                    content: "Cập nhật thành công!",
                    onOk: () => {
                    }
                })

            }
        } catch (err) {
            console.log(err);
            Modal.error({
                title: 'Error!',
                content: err.response?.data?.message,
                onOk: () => {
                    setShowDes(!showDes)
                }
            })

        }
    }
    return (
        <div className='product_describe_form'>
            <form onSubmit={(e) => {
                handleSaveDes(e)
            }}>
                <div className='btn_box'>
                    <span>Product Description</span>
                    <button onClick={() => {
                        setShowDes(!showDes)
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "120px" }} id="basic-addon1">Description</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        placeholder="Describe"
                        name='des'
                        defaultValue={updateData.detail.desc}
                        style={{ height: 200 }}
                    />
                </InputGroup>
            </form>
        </div>
    )
}
