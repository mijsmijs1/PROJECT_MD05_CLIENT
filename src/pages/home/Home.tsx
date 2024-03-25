import './home.scss'
import { Carousel } from '@/components/carousels/Carousel'
import { Product } from '@/components/product/Product'
import { Modal } from 'antd';
import img from '../../../public/img/technologies.png'
import { useEffect } from 'react';
export default function Home() {
  useEffect(() => {
    Modal.info({
      title: "Welcome to Nguy Phu Quy's website!",
      content: (
        <div style={{ width: '700px', height: '600px' }}>
          <p>Some information about my website.</p>
          <img src={img} alt="Description of image" style={{ maxWidth: '100%', height: 'auto' }} />
          <p>Facebook: facebook.com/phuquy119</p>
          <p>Zalo: 0936549721</p>
          <p>Github Client: https://github.com/mijsmijs1/PROJECT_MD05_CLIENT</p>
          <p>Github Server: https://github.com/mijsmijs1/PROJECT_MD05_SERVER</p>
        </div>
      ),
      width: '42%',
      onOk: () => {
        // Thêm xử lý khi nhấn nút "OK" ở đây nếu cần
      }
    });
  }, [])
  return (
    <div className='home_app'>
      <div className='home_container'>
        <Carousel />
        <Product />
      </div>
    </div>
  )
}
