import { randomId } from '@mieuteacher/meomeojs';

import { InputGroup, Form } from 'react-bootstrap';
import { Category, categoryAction } from '@slices/category.slice';

import { Modal, message } from 'antd';

import { api } from '@/services/apis';

export default function CategoryEditForm({ dispatch, setDisplayEdit, updateData }: {
    dispatch: any,
    setDisplayEdit: any,
    updateData: Category
}) {
    async function handleEditCategory(e) {
        e.preventDefault();
        try {
            if (e.target.name.value == updateData.name && e.target.codeName.value == updateData.codeName) {
                message.warning("Nothing change!")
            }
            if (!e.target.name.value || !e.target.codeName.value) {
                message.warning("Please fill full!")
            }
            let newCate = {
                name: e.target.name.value,
                codeName: e.target.codeName.value,
                status: Boolean(e.target.status.value) ? 'active' : "inactive"
            }
            let result = await api.category.update(updateData.id, newCate)
            console.log('result', result);
            Modal.success({
                title: "Notication",
                content: "Bạn đã update danh mục thành công!",
                onOk: () => {
                    dispatch(categoryAction.update(result.data.data))
                    e.target.name.value = ""
                    e.target.status.value = null
                    setDisplayEdit(false)
                }
            })
        } catch (err) {
            console.log("err", err)
            alert("1")
        }
    }
    return (
        <div className='category_create_form'>
            <form onSubmit={(e) => {
                handleEditCategory(e)
            }}>
                <div className='btn_box'>
                    <span>Create Category</span>
                    <button onClick={() => {
                        setDisplayEdit(false)
                    }} type='button' className='btn btn-danger'>X</button>
                </div>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Name</InputGroup.Text>
                    <Form.Control
                        placeholder="Category Name"
                        name='name'
                        defaultValue={updateData.name}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Code Name</InputGroup.Text>
                    <Form.Control
                        placeholder="Category Code Name"
                        name='codeName'
                        defaultValue={updateData.codeName}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Status</InputGroup.Text>
                    <Form.Select name='status' aria-label="Default select example" value={updateData.status}>
                        <option value={null}>Please choose</option>
                        <option key={randomId()} value={1}>Active</option>
                        <option key={randomId()} value={0}>Block</option>
                    </Form.Select>
                </InputGroup>
                <button type='submit' className='btn btn-success'>Save</button>
            </form>
        </div>
    )
}