import axios from "axios"
const prefix = "authen"
export default {
    login: async (loginData: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/login`, loginData)
    },
    decodeToken: async (token: string | null) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/decodeToken/${token}`)
    },
    loginWithGoogle: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/loginWithGoogle`, data)
    },
    getUserById: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}`)
    },
    findMany: async function () {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}`);
    },
    create: async (user: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/register`, user)
    },
    forgotPassword: async (data: { email: string }) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/forgotPassword`, data)
    },

}