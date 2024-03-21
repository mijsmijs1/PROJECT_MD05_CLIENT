import axios from "axios";
const prefix = 'product';
export default {
    createProduct: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
    },
    updateVideo: async (data: any, productId: number) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/updateVideo/${productId}`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
    },
    updateImg: async (data: any, productId: number) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/updateImg/${productId}`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
    },
    getProduct: async (page: number = 1) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/home/${page}`)
    },
    getProductTotal: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/total`)
    },
    getStatusCount: async (id: Number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/status-count/${id}`)
    },
    getProductById: async (id: Number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}`)
    },
    getProductByUserId: async (userId: Number, status: string, page: number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/getByUserId?userId=${userId}&&status=${status}&&page=${page}`)
    },
    getAllProduct: async (userId: Number = -1, status: string, page: number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/getAllProduct?userId=${userId}&&status=${status}&&page=${page}`)
    },
    getProductSearch: async (keyWord: String, codeName: string) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/search?keyword=${keyWord}&&category=${codeName}`)
    },

    getProductSearchFull: async (keyWord: String, page: number, sortBy: string, codeName: string, address: string) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/search-full?keyword=${keyWord}&&page=${page}&&sortBy=${sortBy}&&category=${codeName}&&address=${address}`)
    },
    getProducCategory: async (categoryId: string, page: number, sortBy: string, address: string) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/product-category?category=${categoryId}&&page=${page}&&sortBy=${sortBy}&&address=${address}`)
    },
    getProducBranch: async (branchId: string, page: number, sortBy: string, address: string) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/product-branch?branch=${branchId}&&page=${page}&&sortBy=${sortBy}&&address=${address}`)
    },
    getProductReviewing: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/reviewing`)
    },
    getProductDelete: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/delete`)
    },
    update: async (id, data) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}`, data)
    }
    ,
    updateByAdmin: async (id, data) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/updateByAdmin/${id}`, data)
    }
    ,
    pushProduct: async (id: number) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/push-product/${id}`)
    }


}