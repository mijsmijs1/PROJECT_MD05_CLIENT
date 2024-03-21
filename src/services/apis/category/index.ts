import axios from "axios";
const prefix = "category";
export default {
    findCategory: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}`)
    },
    findAllCategory: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/all`)
    },
    create: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}`, data)
    },
    update: async (categoryId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${categoryId}`, data)
    },
}