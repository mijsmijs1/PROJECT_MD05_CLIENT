import { randomId } from '@mieuteacher/meomeojs';
import React, { useState } from 'react'
import { InputGroup, Form } from 'react-bootstrap';



import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { Store } from '@/stores';
import { uploadToFirebase } from '@/services/firebase';
import { api } from '@/services/apis';
import { userAction } from '@/stores/slices/user.slice';
export default function UserCreateForm({ dispatch }) {
  const userStore = useSelector((store: Store) => store.userStore)
  async function handleAddUser(e) {
    e.preventDefault();
    try {
      let newUser = {
        userName: e.target.userName.value,
        email: e.target.email.value,
        password: "123456",
        avatar: await uploadToFirebase(e.target.avatar.files[0], "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"),
        status: Boolean(e.target.status.value)
      }
      console.log(newUser);
      let result = await api.authen.create({
        ...newUser
      })
      console.log('result', result);
      Modal.success({
        title: "Notication",
        content: "Bạn đã thêm user thành công!",
        onOk: () => {
          dispatch(userAction.adduser(result.data.data))
          // e.target.userName.value = ""
          // e.target.email.value = ""
          // e.target.status.value = null
          // e.target.role.value = null
          // e.target.avatar.value = null
          dispatch(userAction.loadModal())
        }
      })
    } catch (err) {
      console.log("err", err)
      Modal.error({
        title: "Lỗi",
        content: err.response?.data?.message.join(" ") || "Lỗi không rõ!"
      })
    }
  }
  return (
    <div className='user_create_form'>
      <form onSubmit={(e) => {
        handleAddUser(e)
      }}>
        <div className='btn_box'>
          <span>Create User</span>
          <button onClick={() => {
            dispatch(userAction.loadModal())
          }} type='button' className='btn btn-danger'>X</button>
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">User Name</InputGroup.Text>
          <Form.Control
            placeholder="User Name"
            name='userName'
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Email</InputGroup.Text>
          <Form.Control
            placeholder="Email"
            name='email'
          />
        </InputGroup>

        {/* <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Role</InputGroup.Text>
          <Form.Select name='role' aria-label="Default select example">
            <option value={null}>Please choose</option>
            <option key={randomId()} value="admin">Admin</option>
            <option key={randomId()} value="member">Member</option>
          </Form.Select>
        </InputGroup> */}

        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Avatar</InputGroup.Text>
          <div className='input_avatar'>
            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" />
            <input onChange={(e) => {
              if (e.target.files.length > 0) {
                let spanEl = e.target.parentNode.querySelector('span');
                let imgEl = e.target.parentNode.querySelector('img');
                (spanEl as any).style.opacity = 0;
                imgEl.src = URL.createObjectURL(e.target.files[0])
              }
            }} name='avatar' type="file" />
            <span>+</span>
          </div>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Status</InputGroup.Text>
          <Form.Select name='status' aria-label="Default select example">
            <option value={null}>Please choose</option>
            <option key={randomId()} value={true}>Active</option>
            <option key={randomId()} value={false}>Block</option>
          </Form.Select>
        </InputGroup>
        <button type='submit' className='btn btn-success'>Add</button>
      </form>
    </div>
  )
}