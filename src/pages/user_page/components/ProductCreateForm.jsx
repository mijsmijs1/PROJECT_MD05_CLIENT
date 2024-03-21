import { randomId } from '@mieuteacher/meomeojs';
import React, { useState } from 'react'
import { InputGroup, Form } from 'react-bootstrap';
import { productAction } from '../../../../../store/slices/product.slice';
import { uploadToFirebase } from '@services/firebase'
import api from '@services/apis'
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
export default function ProductCreateForm({ dispatch }) {
  const [picturesPreview, setPicturesPreview] = useState([]);
  const categoryStore = useSelector(store => store.categoryStore)
  const brandStore = useSelector(store => store.brandStore)
  console.log('categoryStore', categoryStore);
  async function handleAddProduct(e) {
    e.preventDefault();
    if (!e.target.avatar.files[0]) return
    try {
      let newProduct = {
        name: e.target.name.value,
        price: Number(e.target.price.value),
        avatar: await uploadToFirebase(e.target.avatar.files[0]),
        categoryId: Number(e.target.categoryId.value),
        des: e.target.des.value,
        brandId: Number(e.target.brandId.value),
      }
      let pictures = [];

      for (let i in picturesPreview) {
        let url = await uploadToFirebase(picturesPreview[i].file)
        pictures.push({
          url
        })
        console.log('url', url);
      }

      let result = await api.product.create({
        newProduct,
        pictures
      })

      Modal.success({
        title: "Notication",
        content: "Bạn đã thêm sản phẩm thành công!",
        onOk: () => {
          dispatch(productAction.addData(result.data.data))
          e.target.name.value = ""
          e.target.price.value = ""
          setPicturesPreview([])
          e.target.avatar.value = null
          dispatch(productAction.loadModal())
        }
      })
    } catch (err) {
      console.log("err", err)
      alert("1")
    }
  }
  return (
    <div className='product_create_form'>
      <form onSubmit={(e) => {
        handleAddProduct(e)
      }}>
        <div className='btn_box'>
          <span>Create Product</span>
          <button onClick={() => {
            dispatch(productAction.loadModal())
          }} type='button' className='btn btn-danger'>X</button>
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Name</InputGroup.Text>
          <Form.Control
            placeholder="Product Name"
            name='name'
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Price</InputGroup.Text>
          <Form.Control
            placeholder="Product Price"
            name='price'
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Avatar</InputGroup.Text>
          <div className='input_avatar'>
            <img src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg" />
            <input onChange={(e) => {
              if (e.target.files.length > 0) {
                let spanEl = e.target.parentNode.querySelector('span');
                let imgEl = e.target.parentNode.querySelector('img');
                spanEl.style.opacity = 0;
                imgEl.src = URL.createObjectURL(e.target.files[0])
              }
            }} name='avatar' type="file" />
            <span>+</span>
          </div>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Describe</InputGroup.Text>
          <Form.Control
            as="textarea"
            placeholder="Describe"
            name='des'
          />
        </InputGroup>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Picture List</Form.Label>
          <Form.Control onChange={(e) => {
            let tempArr = [];
            if (e.target.files.length > 0) {
              for (let i in e.target.files) {
                if (i == "length") {
                  break
                }
                tempArr.push({
                  url: URL.createObjectURL(e.target.files[i]),
                  file: e.target.files[i]
                })
              }
            }
            if (picturesPreview.length + tempArr.length > 10) {
              alert("max size 10")
              return
            }
            setPicturesPreview([...tempArr, ...picturesPreview])
          }} type="file" multiple max={10} />
        </Form.Group>
        <div className='pictures'>
          {
            picturesPreview.map((item, index) => (
              <div key={randomId()} className='item'>
                <img src={item.url} />
                <button type='button' onClick={() => {
                  setPicturesPreview(picturesPreview?.filter((itemFilter, indexFilter) => indexFilter != index))
                }} className='btn btn-danger'>X</button>
              </div>
            ))
          }
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Category</InputGroup.Text>
          <Form.Select name='categoryId' aria-label="Default select example">
            <option value={null}>Please choose</option>
            {
              categoryStore?.data?.map(item => (
                <option key={randomId()} value={item.id}>{item.title}</option>
              ))
            }
          </Form.Select>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "80px" }} id="basic-addon1">Brand</InputGroup.Text>
          <Form.Select name='brandId' aria-label="Default select example">
            <option value={null}>Please choose</option>
            {
              brandStore?.data?.map(item => (
                <option key={randomId()} value={item.id}>{item.title}</option>
              ))
            }
          </Form.Select>
        </InputGroup>
        <button type='submit' className='btn btn-success'>save</button>
      </form>
    </div>
  )
}