import { useState, useEffect } from 'react'
import { Table, Modal, Button } from 'react-bootstrap';

import { randomId, convertToVND } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '@/stores';
import { userAction } from '@/stores/slices/user.slice';
import { api } from '@/services/apis';
import { receiptAction } from '@/stores/slices/receipt.slice';
import UserEditForm from './components/UserEditForm';

export default function Recycle() {
    const dispatch = useDispatch();
    const userStore = useSelector((store: Store) => store.userStore)
    const [showAddress, setShowAddress] = useState(false);
    const [updateData, setupdateData] = useState(null);
    const [showIp, setShowIp] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [display, setDisplay] = useState(false)
    const [currentRecreipt, setCurrentRecreipt] = useState(null)
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [getUser, setGetUser] = useState(false);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh' // Múi giờ Việt Nam (GMT+7)
    };
    const handleConfirm = async () => {
        try {
            let result = await api.user.updateByAdmin(updateData.id, { role: updateData.role, status: true });
            console.log('result', result);
            if (result.status == 200) {
                dispatch(userAction.update(result.data.data));
                setGetUser(!getUser)
                window.alert("Hủy block thành công!")
            }
        } catch (err) {
            console.log('err', err);
            window.alert(`${err.response.data.message}`)
        }
        setShow(false);
    };

    const handleCancel = () => {
        setShow(false);
    };
    useEffect(() => {
        try {
            api.user.findMany()
                .then(async (res) => {
                    dispatch(userAction.setList(Object.values(res.data.data)))
                })
                .catch(err => {
                    console.log(err);
                })
        } catch (err) {
            console.log(err);
        }

        console.log("da vao effect");
    }, [getUser])

    return (
        <>
            {/* {
                userStore.addModal && <UserCreateForm dispatch={dispatch} />
            } */}
            {
                showEdit && <UserEditForm showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} />
            }
            <h4>User List</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Create At</th>
                        <th>Update At</th>

                        <th>Address</th>
                        <th>Ip list</th>
                        <th>Receipts</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userStore.list?.map((item, index) => {
                            if (!item.status) {
                                return (
                                    <tr key={randomId()}>
                                        <td>{index + 1}</td>
                                        <td >{item.userName}</td>
                                        <td >{item.email}</td>
                                        <td >{item.createAt ? (new Date(Number(item.createAt))).toLocaleString('en-GB', options) : "null"}</td>
                                        <td >{item.updateAt ? (new Date(Number(item.updateAt))).toLocaleString('en-GB', options) : "null"}</td>
                                        {/* <td >{item.role}</td> */}
                                        <td ><button
                                            onClick={() => {
                                                setShowAddress(!showAddress)
                                                setupdateData(item)
                                            }}
                                            className="btn btn-primary">Show</button></td>
                                        <td ><button
                                            onClick={() => {
                                                setShowIp(!showIp)
                                                setupdateData(item)
                                            }}
                                            className="btn btn-primary">Show & Edit</button></td>
                                        <td ><button
                                            onClick={() => {
                                                setShowReceipt(!showReceipt)
                                                setupdateData(item)
                                            }}
                                            className="btn btn-primary">Show & Edit</button></td>

                                        <td>
                                            <button
                                                onClick={() => {
                                                    setShowEdit(!showEdit)
                                                    setupdateData(item)
                                                }}
                                                className="btn btn-primary" style={{ marginRight: 5 }}>Edit</button>
                                            {
                                                <button
                                                    onClick={() => {
                                                        setShow(true)
                                                        setupdateData(item)
                                                    }}
                                                    className="btn btn-success"
                                                >Unblock</button>
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
                <Modal show={show} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to unblock this user?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                        <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
            </Table >
            {
                showAddress && <div className='table_container'>
                    <div className='table_content'>
                        <div className='btn_box'>
                            <span>Address Infomation</span>
                            <button onClick={() => {
                                setShowAddress(!showAddress)
                            }} type='button' className='btn btn-danger'>X</button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Address</th>
                                    <th>Provine ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    updateData.address?.map((item, index) => {
                                        return (
                                            <tr key={randomId()}>
                                                <td>{index + 1}</td>
                                                <td >{item.title}</td>
                                                <td >{item.provineId}</td>
                                            </tr>
                                        )

                                    })
                                }
                            </tbody>
                        </Table >
                    </div>
                </div>
            }

            {
                showIp && <div className='table_container'>
                    <div className='table_content'>
                        <div className='btn_box'>
                            <span>IP list Infomation</span>
                            <button onClick={() => {
                                setShowIp(!showIp)
                            }} type='button' className='btn btn-danger'>X</button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>IP</th>
                                    <th>Device Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    updateData.user_ip_list?.map((item, index) => {
                                        return (
                                            <tr key={randomId()}>
                                                <td>{index + 1}</td>
                                                <td >{item.ip}</td>
                                                <td >{item.deviceName}</td>
                                                <td style={{ color: item.status ? "green" : "red" }}>{item.status ? "Active" : "Block"}</td>
                                            </tr>
                                        )

                                    })
                                }
                            </tbody>
                        </Table >
                    </div>
                </div>
            }

            {
                showReceipt && <div className='table_container '>
                    <div className='table_content table_receipt'>
                        <div className='btn_box'>
                            <h4>Receipts Infomation</h4>
                            <button onClick={() => {
                                setShowReceipt(!showReceipt)
                            }} type='button' className='btn btn-danger'>X</button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Detail Info</th>
                                    <th>Total Price</th>
                                    <th>Pay Status</th>
                                    <th>Pay At</th>
                                    <th>Pay Method</th>
                                    <th>Status</th>
                                    <th>Pending At</th>
                                    <th>Accept At</th>
                                    <th>Shipping At</th>
                                    <th>Done At</th>
                                    <th>Tools</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    updateData.receipts?.map((item, index) => {
                                        if (item.status != "delete") {
                                            return (
                                                <tr key={randomId()}>
                                                    <td>{item.id || "null"}</td>
                                                    <td><button
                                                        onClick={() => {
                                                            setDisplay(true);
                                                            setCurrentRecreipt(item)
                                                        }}
                                                        className="btn btn-primary">Show!</button></td>
                                                    <td>{convertToVND(item.total) || "null"}</td>
                                                    <td>{item.paid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                                                    <td>{item.paidAt ? (new Date(Number(item.paidAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.payMode || "null"}</td>
                                                    <td>{item.status || "null"}</td>
                                                    <td>{item.pending ? (new Date(Number(item.pending))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.acceptAt ? (new Date(Number(item.acceptAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.shippingAt ? (new Date(Number(item.shippingAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.doneAt ? (new Date(Number(item.doneAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td><button
                                                        onClick={() => {
                                                            setCurrentRecreipt(item)
                                                            setShowDelete(!showDelete)
                                                        }}
                                                        className="btn btn-danger">Delete!</button></td>
                                                </tr>
                                            )
                                        }


                                    })
                                }
                            </tbody>
                        </Table >
                        <h5 style={{ color: "red" }}>Deleted Receipts Infomation</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Detail Info</th>
                                    <th>Total Price</th>
                                    <th>Pay Status</th>
                                    <th>Pay At</th>
                                    <th>Pay Method</th>
                                    <th>Status</th>
                                    <th>Pending At</th>
                                    <th>Accept At</th>
                                    <th>Shipping At</th>
                                    <th>Delete At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    updateData.receipts?.map((item, index) => {
                                        if (item.status == "delete") {
                                            return (
                                                <tr key={randomId()}>
                                                    <td>{item.id || "null"}</td>
                                                    <td><button
                                                        onClick={() => {
                                                            setDisplay(true);
                                                            setCurrentRecreipt(item)
                                                        }}
                                                        className="btn btn-primary">Show!</button></td>
                                                    <td>{convertToVND(item.total) || "null"}</td>
                                                    <td>{item.paid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                                                    <td>{item.paidAt ? (new Date(Number(item.paidAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.payMode || "null"}</td>
                                                    <td style={{ color: "red" }}>{item.status || "null"}</td>
                                                    <td>{item.pending ? (new Date(Number(item.pending))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.acceptAt ? (new Date(Number(item.acceptAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.shippingAt ? (new Date(Number(item.shippingAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                    <td>{item.updateAt ? (new Date(Number(item.updateAt))).toLocaleString('en-GB', options) : "null"}</td>
                                                </tr>
                                            )
                                        }


                                    })
                                }
                            </tbody>
                        </Table >
                    </div>
                    <Modal
                        show={display}
                        onHide={() => setDisplay(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Thông tin hóa đơn của bạn</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='item_container_title'>
                                <p>Hình ảnh</p>
                                <p>Tên sản phẩm</p>
                                <p>Giá tiền</p>
                                <p>Số lượng</p>
                            </div>
                            {
                                currentRecreipt?.detail?.map(item => {

                                    return (
                                        <div className='item_container'>
                                            <img src={item?.product.avatar} />
                                            <p>{item.product.name}</p>
                                            <p>{convertToVND(item.product.price)}</p>
                                            <p>{item.quantity}</p>
                                        </div>
                                    )

                                }
                                )
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => setDisplay(false)}>OK</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal
                        show={showDelete}
                        onHide={() => setShowDelete(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Bạn có chắc muốn hủy đơn hàng này không?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='item_container_title'>
                                <p>Hình ảnh</p>
                                <p>Tên sản phẩm</p>
                                <p>Giá tiền</p>
                                <p>Số lượng</p>
                            </div>
                            {
                                currentRecreipt?.detail?.map(item => {

                                    return (
                                        <div className='item_container'>
                                            <img src={item?.product.avatar} />
                                            <p>{item.product.name}</p>
                                            <p>{convertToVND(item.product.price)}</p>
                                            <p>{item.quantity}</p>
                                        </div>
                                    )

                                }
                                )
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={async () => {
                                try {
                                    let result = await api.receipt.updateReceipt(currentRecreipt.id, { status: "delete" })
                                    if (result.status == 200) {
                                        dispatch(receiptAction.update(result.data.data))
                                        let newReceipt = updateData.receipts.map(item => {
                                            if (item.id == result.data.data.id) {
                                                return result.data.data
                                            } else {
                                                return item
                                            }
                                        })
                                        setupdateData({ ...updateData, receipts: newReceipt })
                                        setGetUser(!getUser)
                                        window.alert("Hủy đơn hàng thành công!")
                                    }
                                } catch (err) {
                                    console.log('err', err);
                                    window.alert("Lỗi he thong, vui long thu lai sau!")
                                }
                                setShowDelete(false)
                            }}>OK</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            }
        </>
    )
}