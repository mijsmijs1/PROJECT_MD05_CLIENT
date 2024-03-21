import { randomId } from '@mieuteacher/meomeojs';
import React, { useState } from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { categoryAction } from '@slices/category.slice';
import { uploadToFirebase } from '@services/firebase'
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { Store } from '@/stores';
import { api } from '@/services/apis';

export default function CategoryCreateForm({ dispatch }) {
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  async function handleAddCategory(e) {
    e.preventDefault();
    try {
      let newCate = {
        name: e.target.name.value,
        codeName: e.target.codeName.value,
        status: Boolean(e.target.status.value) ? 'active' : 'inactive'
      }
      console.log(newCate);
      let result = await api.category.create(newCate)
      console.log('result', result);
      Modal.success({
        title: "Notication",
        content: "Bạn đã thêm danh mục thành công!",
        onOk: () => {
          dispatch(categoryAction.addData(result.data.data))
          e.target.name.value = ""
          e.target.status.value = null
          dispatch(categoryAction.loadModal())
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
        handleAddCategory(e)
      }}>
        <div className='btn_box'>
          <span>Create Category</span>
          <button onClick={() => {
            dispatch(categoryAction.loadModal())
          }} type='button' className='btn btn-danger'>X</button>
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Name</InputGroup.Text>
          <Form.Control
            placeholder="Category Name"
            name='name'
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Code Name</InputGroup.Text>
          <Form.Control
            placeholder="Category Code Name"
            name='codeName'
          />
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