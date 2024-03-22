import { useState, useEffect } from 'react'
import { Table, Modal, Button } from 'react-bootstrap';
import './list.scss'
import { randomId, convertToVND } from '@mieuteacher/meomeojs';
import { useSelector, useDispatch } from 'react-redux';
import UserCreateForm from './components/UserCreateForm';
import UserEditForm from './components/UserEditForm';
import { Store } from '@/stores';
import { api } from '@/services/apis';
import { userAction } from '@/stores/slices/user.slice';
import { useNavigate } from 'react-router-dom';
import { receiptAction } from '@/stores/slices/receipt.slice';
import { message } from 'antd';
export default function List() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
    const [userStatus, setUserStatus] = useState(true);
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
            let result = await api.user.updateByAdmin(updateData.id, { status: !userStatus });
            if (result.status == 200) {
                dispatch(userAction.update(result.data.data));
                message.success(`Bạn đã ${userStatus ? 'khóa' : 'mở khóa'} thành công tài khoản ${result.data.data.userName}`)
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
    let users = []
    useEffect(() => {
        try {
            api.user.findMany()
                .then(async (res) => {
                    users = res.data.data.filter(user => user.status == userStatus)
                    dispatch(userAction.setList(users))
                })
                .catch(err => {
                    console.log(err);
                })
        } catch (err) {
            console.log(err);
        }
        console.log("da vao effect");
    }, [getUser, userStatus, show])

    return (
        <div className='user_info_box'>
            <h1>User Management</h1>
            {
                userStore.addModal && <UserCreateForm dispatch={dispatch} />
            }
            {
                showEdit && <UserEditForm showEdit={showEdit} setShowEdit={setShowEdit} updateData={updateData} />
            }
            <div className="button-container">
                <button className="btn user-list-btn"
                    style={{ backgroundColor: userStatus ? '#489ffc' : '#007bff', textDecoration: userStatus ? 'underline' : 'unset' }}
                    onClick={() => {
                        setUserStatus(true)
                    }}
                >User List</button>
                <button
                    style={{ backgroundColor: !userStatus ? '#489ffc' : '#007bff', textDecoration: !userStatus ? 'underline' : 'unset' }}
                    onClick={() => {
                        setUserStatus(false)
                    }}
                    className="btn blocked-users-btn">Blocked users</button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Avatar</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Create At</th>
                        <th>Ip lists</th>
                        <th>Product</th>
                        {/* <th>Receipts</th> */}
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userStore.list?.map((item, index) => {

                            return (
                                <tr key={randomId()}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            onClick={() => {
                                                window.location.href = `/user_info?userId=${item.id}`
                                            }}
                                            src={item.avatar.includes('img/') ? `${import.meta.env.VITE_SV_HOST}/${item.avatar}` : `${item.avatar}`} style={{ width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer" }} />
                                    </td>
                                    <td >{item.userName}</td>
                                    <td >{item.email}</td>
                                    <td >{item.createAt ? (new Date(Number(item.createAt))).toLocaleString('en-GB', options) : "null"}</td>
                                    <td ><button
                                        onClick={() => {
                                            setShowIp(!showIp)
                                            setupdateData(item)
                                        }}
                                        className="btn btn-primary">Show</button></td>

                                    <td ><button
                                        onClick={() => {
                                            navigate(`/admin/user-product-info?userId=${item.id}`)
                                        }}
                                        className="btn btn-primary">Show</button></td>
                                    {/* <td ><button
                                            onClick={() => {
                                                setShowReceipt(!showReceipt)
                                                setupdateData(item)
                                            }}
                                            className="btn btn-primary">Show & Edit</button></td> */}

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
                                                className={userStatus ? "btn btn-danger" : "btn btn-success"}

                                            >{userStatus ? "Block" : "UnBlock"}</button>
                                        }
                                    </td>
                                </tr>
                            )

                        })
                    }
                </tbody>
                <Modal show={show} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to block (unblock) this user?
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
                                    {/* <th>Device Name</th> */}
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    JSON.parse(updateData.ipList)?.map((item, index) => {
                                        return (
                                            <tr key={randomId()}>
                                                <td>{index + 1}</td>
                                                <td >{item}</td>
                                                {/* <td >{item.deviceName}</td> */}
                                                <td style={{ color: !item.status ? "green" : "red" }}>{!item.status ? "Active" : "Block"}</td>
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
                                    updateData.receipts?.map((item) => {
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
                                    updateData.receipts?.map((item) => {
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
        </div>
    )
}