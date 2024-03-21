import axios from 'axios';
export default {
    payZalo: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/wallet/payZalo`, data)
    },
    zaloCheck: async (zaloPayReceiptId: any, userName: string) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/wallet/payZaloCheck/${zaloPayReceiptId}`, { userName: userName })
    },
    getTotalRevenue: async () => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/wallet/total-revenue`)
    }
}