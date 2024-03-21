import axios from "axios"
const prefix = "user"
export interface PaymentData {
    amount: number
}
export default {
    getUserById: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}`)
    },
    getUserByIdByAdmin: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/getByAdmin/${id}`)
    },
    getUserCount: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/get-count`)
    },
    cormFirmEmail: async (id: number, data: any) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/confirm-email/${id}`, data)
    },
    findMany: async function () {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}`);
    },
    payment: async (userId: number, paymentData: PaymentData) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/payment/${userId}`, paymentData)
    },
    update: async (userId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${userId}`, data)
    },
    updateByAdmin: async (userId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/updateByAdmin/${userId}`, data)
    },
    updateAvatar: async (userId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/update-avatar/${userId}`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
    },
    changePass: async (userId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/change-password/${userId}`, data)
    },
    changeEmail: async (userId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/change-email/${userId}`, data)
    },
    create: async (user: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/register`, user)
    },

}