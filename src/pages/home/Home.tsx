import './home.scss'
import { Carousel } from '@/components/carousels/Carousel'
import { Product } from '@/components/product/Product'
export default function Home() {
  return (
    <div className='home_app'>
                <div className='home_container'>
                    <Carousel/>
                    <Product/>
                </div>
            </div>
  )
}
