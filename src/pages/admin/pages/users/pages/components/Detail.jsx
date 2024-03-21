import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit'
import React from 'react'

export default function Detail(showInfo,setShowInfo, updateData) {
    console.log('updateData',updateData);
    let detail = updateData.detail;
    return (
        <>
            {
                showInfo &&
                <div className='product_info_container' >
                    <div className='product_info_background' onClick={() => { setShowInfo(!showInfo) }}></div>
                    <div className='product_info_content'>
                        <h5>Thông tin chi tiết:</h5>
                        {
                            <MDBTable striped>
                                <MDBTableBody>
                                    {detail.name &&
                                        <tr>
                                            <th scope='row'>Name</th>
                                            <td>{detail.name}</td>
                                        </tr>}
                                    {detail.type &&
                                        <tr>
                                            <th scope='row'>Type</th>
                                            <td>{detail.type}</td>
                                        </tr>}
                                    {detail.used &&
                                        <tr>
                                            <th scope='row'>Status</th>
                                            <td>{detail.used}</td>
                                        </tr>}
                                    {detail.color &&
                                        <tr>
                                            <th scope='row'>Color</th>
                                            <td>{detail.color}</td>
                                        </tr>}
                                    {detail.ram &&
                                        <tr>
                                            <th scope='row'>RAM</th>
                                            <td>{detail.ram}</td>
                                        </tr>}
                                    {detail.guarantee &&
                                        <tr>
                                            <th scope='row'>Warranty</th>
                                            <td>{detail.guarantee}</td>
                                        </tr>}
                                    {detail.RegisteredAt &&
                                        <tr>
                                            <th scope='row'>Registered At</th>
                                            <td>{detail.RegisteredAt}</td>
                                        </tr>}

                                    {detail.branch &&
                                        <tr>
                                            <th scope='row'>Branch</th>
                                            <td>{detail.branch}</td>
                                        </tr>}
                                    {detail.cc &&
                                        <tr>
                                            <th scope='row'>Cylinder capacity</th>
                                            <td>{detail.cc}</td>
                                        </tr>}
                                    {detail.motoId &&
                                        <tr>
                                            <th scope='row'>License plates</th>
                                            <td>{detail.motoId}</td>
                                        </tr>}
                                    {detail.km &&
                                        <tr>
                                            <th scope='row'>Number of kilometers run</th>
                                            <td>{detail.km}</td>
                                        </tr>}
                                    {detail.from &&
                                        <tr>
                                            <th scope='row'>Comes from</th>
                                            <td>{detail.from}</td>
                                        </tr>}
                                    {detail.areaName &&
                                        <tr>
                                            <th scope='row'>Area Name</th>
                                            <td>{detail.areaName}</td>
                                        </tr>}
                                    {detail.landNum &&
                                        <tr>
                                            <th scope='row'>Land Number</th>
                                            <td>{detail.landNum}</td>
                                        </tr>}
                                    {detail.direction &&
                                        <tr>
                                            <th scope='row'>Direction</th>
                                            <td>{detail.direction}</td>
                                        </tr>}
                                    {detail.direction &&
                                        <tr>
                                            <th scope='row'>Direction</th>
                                            <td>{detail.direction}</td>
                                        </tr>}
                                    {detail.floor &&
                                        <tr>
                                            <th scope='row'>Floor</th>
                                            <td>{detail.floor}</td>
                                        </tr>}
                                    {detail.bedRoom &&
                                        <tr>
                                            <th scope='row'>BedRoom</th>
                                            <td>{detail.bedRoom}</td>
                                        </tr>}
                                    {detail.badRoom &&
                                        <tr>
                                            <th scope='row'>BadRoom</th>
                                            <td>{detail.badRoom}</td>
                                        </tr>}
                                    {detail.papers &&
                                        <tr>
                                            <th scope='row'>Legal documents</th>
                                            <td>{detail.papers}</td>
                                        </tr>}
                                    {detail.decoration &&
                                        <tr>
                                            <th scope='row'>Decoration Status</th>
                                            <td>{detail.decoration}</td>
                                        </tr>}
                                    {detail.moreInfo &&
                                        <tr>
                                            <th scope='row'>More Infomation</th>
                                            <td>{detail.moreInfo}</td>
                                        </tr>}
                                    {detail.area &&
                                        <tr>
                                            <th scope='row'>Acreage</th>
                                            <td>{detail.area} {detail.unit ? detail.unit : `(m²)`}</td>
                                        </tr>}
                                    {detail.useArea &&
                                        <tr>
                                            <th scope='row'>Used Acreage</th>
                                            <td>{detail.useArea} (m²)</td>
                                        </tr>}
                                    {detail.xSide &&
                                        <tr>
                                            <th scope='row'>Horizontal Length</th>
                                            <td>{detail.xSide} (m²)</td>
                                        </tr>}
                                    {detail.ySide &&
                                        <tr>
                                            <th scope='row'>Vertical Length</th>
                                            <td>{detail.ySide} (m²)</td>
                                        </tr>}


                                </MDBTableBody>
                            </MDBTable>
                        }

                    </div>
                </div>
            }
        </>
    )
}
