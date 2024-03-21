import { randomId } from '@mieuteacher/meomeojs';
import { InputGroup, Form } from 'react-bootstrap';
import { categoryAction } from '@slices/category.slice';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { Store } from '@/stores';
import { api } from '@/services/apis';

export default function BranchCreateForm({ dispatch }) {
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  async function handleAddBranch(e) {
    e.preventDefault();
    try {
      let newBranch = {
        name: e.target.name.value,
        codeName: e.target.codeName.value,
        status: Boolean(e.target.status.value) ? 'active' : 'inactive',
        categoryId: Number(e.target.category.value)
      }
      console.log(newBranch);
      let result = await api.branch.create(newBranch)
      Modal.success({
        title: "Notication",
        content: "Bạn đã add branch thành công!",
        onOk: () => {
          dispatch(categoryAction.addBranch(result.data.data))
          e.target.name.value = ""
          e.target.status.value = null
          e.target.category.value = null
          dispatch(categoryAction.loadModal())
        }
      })
    } catch (err) {
      console.log("err", err)
      alert("1")
    }
  }
  return (
    <div className='branch_create_form'>
      <form onSubmit={(e) => {
        handleAddBranch(e)
      }}>
        <div className='btn_box'>
          <span>Create Branch</span>
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
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ width: "100px" }} id="basic-addon1">Category</InputGroup.Text>
          <Form.Select name='category' aria-label="Default select example">
            <option value={null}>Please choose category</option>
            {
              categoryStore.category.map(category => {
                return <option value={category.id}>{category.name}</option>
              })
            }
          </Form.Select>
        </InputGroup>
        <button type='submit' className='btn btn-success'>Add</button>
      </form>
    </div>
  )
}