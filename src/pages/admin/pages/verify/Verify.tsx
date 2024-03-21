import { useSelector } from 'react-redux'
import './verify.scss'
import { Store } from '@/store'
import { api } from '@/service/apis'


export default function Verify() {
    const memberStore = useSelector((store: Store) => store.memberStore)


    return (
        <div className='verify_box'>
            <div className='verify'>
                <div className='checkup'>
                    <h3>Kiểm tra lại các phương thức liên lạc</h3>
                    <div className='info'>
                        <div className='email'>
                            <span className='label'>
                                Email hiện tại
                            </span>
                            <span>
                                {memberStore.data?.email}
                            </span>
                        </div>
                        <div className='tel'>
                            <span className='label'>
                                Số điện thoại hiện tại
                            </span>
                            <span>
                                {memberStore.data?.phoneNumber}
                            </span>
                        </div>
                    </div>
                    <div className='button'>
                        <button className='edit'>Sửa thông tin</button>
                        <button className='confirm'>Thông tin đã chính xác</button>
                    </div>

                </div>
                <form>
                    <caption>Cập nhật các phương thức liên lạc mới </caption>
                    <label>
                        <span>
                            Email
                        </span>
                        <div>
                            <input defaultValue={memberStore.data?.email} type='email' name='email' placeholder='Nhập email mới'></input>
                            <button type='button' onClick={(e: any) => {
                                let email = e.target.parentNode.querySelector('input').value;
                                api.member.updateEmail(memberStore.data?.id, email)
                                .then(res => {
                                    console.log("res", res)
                                })
                                .catch(err => {
                                    console.log("err", err)
                                })
                            }}>Xác thực</button>
                        </div>
                    </label>
                    <label>
                        <span>
                            Số điện thoại
                        </span>
                        <div>
                            <input disabled type='' name='tel' placeholder='Nhập số điện thoại mới' defaultValue={memberStore.data?.phoneNumber}></input>
                            <button disabled>Xác thực</button>
                        </div>
                    </label>
                </form>
            </div>
        </div>
    )
}
