
import { InputGroup, FormControl } from 'react-bootstrap';
import { api } from '@/services/apis';
import {  useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { productAction } from '@/stores/slices/product.slice';
export default function DetailShow({ showInfo, setShowInfo, updateData, setUpdateData }) {
  const dispatch = useDispatch();
  const handleEditDetailCom = async (e) => {
    e.preventDefault()
    try {
      let detail = { ...updateData.detail };
      if (detail.name && e.target.name.value !== "" && e.target.name.value !== detail.name) {
        detail.name = e.target.name.value;
      }
      // Check và cập nhật giá trị mới cho Type nếu có thay đổi
      if (detail.type && e.target.type.value !== "" && e.target.type.value !== detail.type) {
        detail.type = e.target.type.value;
      }

      // Check và cập nhật giá trị mới cho Status nếu có thay đổi
      if (detail.used && e.target.used.value !== "" && e.target.used.value !== detail.used) {
        detail.used = e.target.used.value;
      }
      if (detail.color && e.target.color.value !== "" && e.target.color.value !== detail.color) {
        detail.color = e.target.color.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho RAM nếu có thay đổi
      if (detail.ram && e.target.ram.value !== "" && e.target.ram.value !== detail.ram) {
        detail.ram = e.target.ram.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Warranty nếu có thay đổi
      if (detail.guarantee && e.target.guarantee.value !== "" && e.target.guarantee.value !== detail.guarantee) {
        detail.guarantee = e.target.guarantee.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Registered At nếu có thay đổi
      if (detail.RegisteredAt && e.target.RegisteredAt.value !== "" && e.target.RegisteredAt.value !== detail.RegisteredAt) {
        detail.RegisteredAt = e.target.RegisteredAt.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Branch nếu có thay đổi
      if (detail.branch && e.target.branch.value !== "" && e.target.branch.value !== detail.branch) {
        detail.branch = e.target.branch.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Cylinder Capacity nếu có thay đổi
      if (detail.cc && e.target.cc.value !== "" && e.target.cc.value !== detail.cc) {
        detail.cc = e.target.cc.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho License Plates nếu có thay đổi
      if (detail.motoId && e.target.motoId.value !== "" && e.target.motoId.value !== detail.motoId) {
        detail.motoId = e.target.motoId.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Number of kilometers run nếu có thay đổi
      if (detail.km && e.target.km.value !== "" && e.target.km.value !== detail.km) {
        detail.km = e.target.km.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Comes from nếu có thay đổi
      if (detail.from && e.target.from.value !== "" && e.target.from.value !== detail.from) {
        detail.from = e.target.from.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Area Name nếu có thay đổi
      if (detail.areaName && e.target.areaName.value !== "" && e.target.areaName.value !== detail.areaName) {
        detail.areaName = e.target.areaName.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Land Number nếu có thay đổi
      if (detail.landNum && e.target.landNum.value !== "" && e.target.landNum.value !== detail.landNum) {
        detail.landNum = e.target.landNum.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Direction nếu có thay đổi
      if (detail.direction && e.target.direction.value !== "" && e.target.direction.value !== detail.direction) {
        detail.direction = e.target.direction.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Floor nếu có thay đổi
      if (detail.floor && e.target.floor.value !== "" && e.target.floor.value !== detail.floor) {
        detail.floor = e.target.floor.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho BedRoom nếu có thay đổi
      if (detail.bedRoom && e.target.bedRoom.value !== "" && e.target.bedRoom.value !== detail.bedRoom) {
        detail.bedRoom = e.target.bedRoom.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho BadRoom nếu có thay đổi
      if (detail.badRoom && e.target.badRoom.value !== "" && e.target.badRoom.value !== detail.badRoom) {
        detail.badRoom = e.target.badRoom.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Legal documents nếu có thay đổi
      if (detail.papers && e.target.papers.value !== "" && e.target.papers.value !== detail.papers) {
        detail.papers = e.target.papers.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Decoration Status nếu có thay đổi
      if (detail.decoration && e.target.decoration.value !== "" && e.target.decoration.value !== detail.decoration) {
        detail.decoration = e.target.decoration.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho More Information nếu có thay đổi
      if (detail.moreInfo && e.target.moreInfo.value !== "" && e.target.moreInfo.value !== detail.moreInfo) {
        detail.moreInfo = e.target.moreInfo.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Acreage nếu có thay đổi
      if (detail.area && e.target.area.value !== "" && e.target.area.value !== detail.area) {
        detail.area = e.target.area.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Used Acreage nếu có thay đổi
      if (detail.useArea && e.target.useArea.value !== "" && e.target.useArea.value !== detail.useArea) {
        detail.useArea = e.target.useArea.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Horizontal Length nếu có thay đổi
      if (detail.xSide && e.target.xSide.value !== "" && e.target.xSide.value !== detail.xSide) {
        detail.xSide = e.target.xSide.value;
      }

      // Kiểm tra và cập nhật giá trị mới cho Vertical Length nếu có thay đổi
      if (detail.ySide && e.target.ySide.value !== "" && e.target.ySide.value !== detail.ySide) {
        detail.ySide = e.target.ySide.value;
      }
      console.log(detail);

      let result = await api.product.update(updateData.id, { detail: JSON.stringify(detail) })
      if (result.status == 200) {
        Modal.success({
          title: 'Success!',
          content: "Cập nhật thông số kỹ thuật thành công!",
          onOk: () => {
            dispatch(productAction.update(result.data.data))
            setShowInfo(!showInfo)
          }
        })

      }
    } catch (err) {
      console.log(err);
      Modal.error({
        title: 'Error!',
        content: err.response?.data?.message,
        onOk: () => {
          setShowInfo(!showInfo)
        }
      })
    }
  }

  return (
    <div className='product_detail_form'>
      <div className='form_container'>
        <div className='btn_box'>
          <span>Technical specifications</span>
          <button onClick={() => {
            setShowInfo(!showInfo)
          }} type='button' className='btn btn-danger'>X</button>
        </div>
        {
          <form onSubmit={(e) => {
            handleEditDetailCom(e)
          }}>
            {/* Add Name InputGroup with condition */}
            {updateData.detail?.name &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Name</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='name'
                  defaultValue={updateData.detail?.name || ""}
                />
              </InputGroup>
            }

            {/* Add Type InputGroup with condition */}
            {updateData.detail?.type &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Type</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='type'
                  defaultValue={updateData.detail?.type || ""}
                />
              </InputGroup>
            }

            {/* Add Status InputGroup with condition */}
            {updateData.detail?.used &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Status</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='used'
                  defaultValue={updateData.detail?.used || ""}
                />
              </InputGroup>
            }

            {/* Add Color InputGroup with condition */}
            {updateData.detail?.color &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Color</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='color'
                  defaultValue={updateData.detail?.color || ""}
                />
              </InputGroup>
            }

            {/* Add RAM InputGroup with condition */}
            {updateData.detail?.ram &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">RAM</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='ram'
                  defaultValue={updateData.detail?.ram || ""}
                />
              </InputGroup>
            }

            {/* Add Warranty InputGroup with condition */}
            {updateData.detail?.guarantee &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Warranty</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='guarantee'
                  defaultValue={updateData.detail?.guarantee || ""}
                />
              </InputGroup>
            }

            {/* Add Registered At InputGroup with condition */}
            {updateData.detail?.RegisteredAt &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Registered At</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='RegisteredAt'
                  defaultValue={updateData.detail?.RegisteredAt || ""}
                />
              </InputGroup>
            }

            {/* Add Branch InputGroup with condition */}
            {updateData.detail?.branch &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Branch</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='branch'
                  defaultValue={updateData.detail?.branch || ""}
                />
              </InputGroup>
            }

            {/* Add Cylinder Capacity InputGroup with condition */}
            {updateData.detail?.cc &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Cylinder Capacity</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='cc'
                  defaultValue={updateData.detail?.cc || ""}
                />
              </InputGroup>
            }

            {/* Add License Plates InputGroup with condition */}
            {updateData.detail?.motoId &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">License Plates</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='motoId'
                  defaultValue={updateData.detail?.motoId || ""}
                />
              </InputGroup>
            }

            {/* Add Number of kilometers run InputGroup with condition */}
            {updateData.detail?.km &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Number of kilometers run</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='km'
                  defaultValue={updateData.detail?.km || ""}
                />
              </InputGroup>
            }

            {/* Add Comes from InputGroup with condition */}
            {updateData.detail?.from &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Comes from</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='from'
                  defaultValue={updateData.detail?.from || ""}
                />
              </InputGroup>
            }
            {/* Add Area Name InputGroup with condition */}
            {updateData.detail?.areaName &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Area Name</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='areaName'
                  defaultValue={updateData.detail?.areaName || ""}
                />
              </InputGroup>
            }

            {/* Add Land Number InputGroup with condition */}
            {updateData.detail?.landNum &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Land Number</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='landNum'
                  defaultValue={updateData.detail?.landNum || ""}
                />
              </InputGroup>
            }

            {/* Add Direction InputGroup with condition */}
            {updateData.detail?.direction &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Direction</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='direction'
                  defaultValue={updateData.detail?.direction || ""}
                />
              </InputGroup>
            }

            {/* Add Floor InputGroup with condition */}
            {updateData.detail?.floor &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Floor</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='floor'
                  defaultValue={updateData.detail?.floor || ""}
                />
              </InputGroup>
            }

            {/* Add BedRoom InputGroup with condition */}
            {updateData.detail?.bedRoom &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">BedRoom</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='bedRoom'
                  defaultValue={updateData.detail?.bedRoom || ""}
                />
              </InputGroup>
            }

            {/* Add BadRoom InputGroup with condition */}
            {updateData.detail?.badRoom &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">BadRoom</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='badRoom'
                  defaultValue={updateData.detail?.badRoom || ""}
                />
              </InputGroup>
            }

            {/* Add Legal documents InputGroup with condition */}
            {updateData.detail?.papers &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Legal documents</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='papers'
                  defaultValue={updateData.detail?.papers || ""}
                />
              </InputGroup>
            }

            {/* Add Decoration Status InputGroup with condition */}
            {updateData.detail?.decoration &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Decoration Status</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='decoration'
                  defaultValue={updateData.detail?.decoration || ""}
                />
              </InputGroup>
            }

            {/* Add More Information InputGroup with condition */}
            {updateData.detail?.moreInfo &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">More Information</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='moreInfo'
                  defaultValue={updateData.detail?.moreInfo || ""}
                />
              </InputGroup>
            }

            {/* Add Acreage InputGroup with condition */}
            {updateData.detail?.area &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Acreage</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='area'
                  defaultValue={updateData.detail?.area || ""}
                />
              </InputGroup>
            }

            {/* Add Used Acreage InputGroup with condition */}
            {updateData.detail?.useArea &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Used Acreage</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='useArea'
                  defaultValue={updateData.detail?.useArea || ""}
                />
              </InputGroup>
            }

            {/* Add Horizontal Length InputGroup with condition */}
            {updateData.detail?.xSide &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Horizontal Length</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='xSide'
                  defaultValue={updateData.detail?.xSide || ""}
                />
              </InputGroup>
            }

            {/* Add Vertical Length InputGroup with condition */}
            {updateData.detail?.ySide &&
              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Vertical Length</InputGroup.Text>
                <FormControl
                  placeholder="Updating"
                  name='ySide'
                  defaultValue={updateData.detail?.ySide || ""}
                />
              </InputGroup>
            }
            <button type='submit' className='btn btn-success'>Save</button>
          </form>
        }

      </div>
    </div>
  )
}
