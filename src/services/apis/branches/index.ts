import axios from "axios";
const prefix = "branch";
export default {
    findBranch: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}`)
    },
    findAllBranch: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/all`)
    },
    create: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}`, data)
    },
    update: async (branchId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${branchId}`, data)
    },
}