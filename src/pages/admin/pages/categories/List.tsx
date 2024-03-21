import  { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Modal } from 'antd'
import './index.scss'
import { randomId } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import CategoryCreateForm from './components/CategoryCreateForm';
import { categoryAction } from '@slices/category.slice';
import { Store } from '@/stores';
import { api } from '@/services/apis';
import CategoryEditForm from './components/CategoryEditForm';
export default function List() {
    const dispatch = useDispatch()
    const categoryStore = useSelector((store: Store) => store.categoryStore)
    const [displayEdit, setDisplayEdit] = useState(false)
    const [updateData, setUpdateData] = useState(null)
    useEffect(() => {
        if (!localStorage.getItem("tokenMember")) return
        const fetchData = async () => {

            try {
                const res = await api.category.findAllCategory();
                if (res.status == 200) {
                    dispatch(categoryAction.setData(res.data.data));

                }
            } catch (err) {
                console.log(err);
            }


        }
        fetchData();
    }, [])
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh' // Múi giờ Việt Nam (GMT+7)
    };
    return (
        <div className='categories_box'>
            {
                categoryStore.addModal && <CategoryCreateForm dispatch={dispatch} />
            }
            {
                displayEdit && <CategoryEditForm dispatch={dispatch} setDisplayEdit={setDisplayEdit} updateData={updateData} />
            }
            <div className='top'>
                <h2>Category List</h2>
                <button
                    onClick={() => {
                        dispatch(categoryAction.loadModal())
                    }}
                    className="create">Create</button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Create At</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoryStore.category?.map((item, index) => {
                            if (item.status) {
                                return (
                                    <tr key={randomId()}>
                                        <td>{index + 1}</td>
                                        <td >{item.name}</td>
                                        <td >{item.createAt ? (new Date(Number(item.createAt))).toLocaleString('en-GB', options) : "null"}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: "Warning",
                                                        content: `Are you sure you want to block this category?`,
                                                        onOk: async () => {
                                                            try {
                                                                let result = await api.category.update(item.id, { status: item.status == 'active' ? "inactive" : "active" })
                                                                if (result.status == 200) {
                                                                    dispatch(categoryAction.update(result.data.data))
                                                                }
                                                            } catch (err) {
                                                                console.log('err', err);
                                                            }
                                                        },
                                                        onCancel: () => { }

                                                    })
                                                }}
                                                className={item.status == 'active' ? "btn btn-danger" : "btn btn-success"}
                                            >{item.status == 'active' ? 'Block' : "UnBlock"}</button>
                                            <button
                                                onClick={() => {
                                                    setDisplayEdit(true)
                                                    setUpdateData(item)
                                                }}

                                                className='btn btn-info'
                                            >Edit</button>
                                        </td>
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </Table >
        </div>
    )
}