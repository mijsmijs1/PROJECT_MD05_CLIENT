
import Layout from '@/pages/layout/Layout'
import Home from '@/pages/home/Home'
import Main from '@/pages/admin/components/main/Main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LazyLoad from '@/utils/lazy'


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />}></Route>
                    <Route path='user_info' element={LazyLoad(() => import("@/pages/user_page/UserPage"), localStorage.getItem('token') ? true : false)()}></Route>
                    <Route path='post' element={LazyLoad(() => import("@/pages/post/Post"), localStorage.getItem('token') ? true : false)()}></Route>
                    <Route path='product-info' element={LazyLoad(() => import("@/pages/product_info/ProductInfo"))()}></Route>
                    <Route path='search' element={LazyLoad(() => import("@/pages/search/Search"))()}></Route>
                </Route>
                <Route path='admin' element={LazyLoad(() => import("@/pages/admin/Admin"), localStorage.getItem('tokenMember') ? true : false, '/admin-authen')()}>
                    <Route index element={<Main />}></Route>
                    <Route path='products' element={LazyLoad(() => import("@/pages/admin/pages/products/List"))()}></Route>
                    <Route path='users' element={LazyLoad(() => import("@/pages/admin/pages/users/List"))()}></Route>
                    <Route path='categories' element={LazyLoad(() => import("@/pages/admin/pages/categories/List"))()}></Route>
                    <Route path='branches' element={LazyLoad(() => import("@/pages/admin/pages/branches/List"))()}></Route>
                    <Route path='user-product-info' element={LazyLoad(() => import("@/pages/admin/pages/users/pages/UserProductInfo"))()}></Route>
                    <Route path='blocked-users' element={LazyLoad(() => import("@/pages/admin/pages/users/Recycle"))()}></Route>
                </Route>
                <Route path='admin-authen' element={LazyLoad(() => import("@/pages/admin/pages/authen/Authen"))()}></Route>
            </Routes>
        </BrowserRouter>
    )
}
