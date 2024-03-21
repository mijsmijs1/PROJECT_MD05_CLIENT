import axios from "axios";
const prefix = "member";

export default {
    login: async (data: {loginId: string, password: string}) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}/login`, data)
    },
    changePassword: async ( id:number ,data:any ) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}/change-password`, data);
    },
    changePermission: async ( id:number ,data:any ) => {
        return await axios.patch(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}/change-permission`, data);
    },
    updateEmail: async ( id:number, data:any ) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/${id}/update-email?type=false&email=${data}`);
    },
    create: async (data:any) => {
        return await axios.post(`${import.meta.env.VITE_SV_API_URL}/${prefix}`, data)
    },
    decodeToken: async (token: string) => {
        return await axios.get(`${import.meta.env.VITE_SV_API_URL}/${prefix}/decodeToken/${token}`)
    }
}