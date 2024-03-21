import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Modal } from 'antd'
import './index.scss'
import { randomId } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import { categoryAction } from '@slices/category.slice';
import { Store } from '@/stores';
import { api } from '@/services/apis';
import BranchCreateForm from './components/BranchCreateForm';
import BranchEditForm from './components/BranchEditForm';
export default function List() {
    const dispatch = useDispatch()
    const categoryStore = useSelector((store: Store) => store.categoryStore)
    const [displayEdit, setDisplayEdit] = useState(false)
    const [updateData, setUpdateData] = useState(null)
    useEffect(() => {
        if (!localStorage.getItem("tokenMember")) return
        const fetchData = async () => {

            try {
                const res = await api.branch.findAllBranch();
                if (res.status == 200) {
                    dispatch(categoryAction.setBranch(res.data.data));

                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])
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
                categoryStore.addModal && <BranchCreateForm dispatch={dispatch} />
            }
            {
                displayEdit && <BranchEditForm dispatch={dispatch} setDisplayEdit={setDisplayEdit} updateData={updateData} />
            }
            <div className='top'>
                <h2>Branch List</h2>
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
                        <th>Category</th>
                        <th>Name</th>
                        <th>Code Name</th>
                        <th>Create At</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoryStore.branch?.map((item, index) => {
                            if (item.status) {
                                return (
                                    <tr key={randomId()}>
                                        <td>{index + 1}</td>
                                        <td >{categoryStore.category?.find(category => category.id == item.categoryId).name || "null"}</td>
                                        <td >{item.name}</td>
                                        <td >{item.codeName}</td>
                                        <td >{item.createAt ? (new Date(Number(item.createAt))).toLocaleString('en-GB', options) : "null"}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: "Warning",
                                                        content: `Are you sure you want to block this branch?`,
                                                        onOk: async () => {
                                                            try {
                                                                let result = await api.branch.update(item.id, { status: item.status == 'active' ? "inactive" : "active" })
                                                                if (result.status == 200) {
                                                                    dispatch(categoryAction.updateBranch(result.data.data))
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