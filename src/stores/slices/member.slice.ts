import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

type MemberRole = "member" | "master" | "admin"

export type member = {
    id: number;
    loginId: string;
    password: string;
    role: MemberRole;
    firstLoginState: boolean;
    createTime: string;
    updateTime: string;
    permission: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    phoneConfirm: boolean;
    email: string;
    emailConfirm: boolean;
    ipList: string;
    avatar: string;
}

export interface OnlineList {
    socketId: string,
    data: member,
    loginAt: string,
    loginTime: string
}

interface InitState {
    data: member | null,
    list: member[] | null,
    onlineList: OnlineList[] | null
    displayAddForm:boolean,
    
}
let initialState: InitState = {
    data: null,
    list: null,
    displayAddForm:false,
    onlineList: null
}

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setList: (state, action) => {
            state.list = action.payload;
        },
        setOnlineList: (state, action) => {
            state.onlineList = action.payload;
        },
        updateList: (state, action) => {
            if(state.list)
            return {
                ...state,
                list: state.list?.map(member => {
                    if(member.id == action.payload.id) {
                        return action.payload
                    }
                    return member
                })
            }
        },
        addMember: (state, action) => {
            state.list?.push(action.payload);
        },
        setDisplayAddForm: (state)=>{
            state.displayAddForm=!state.displayAddForm;
        }
    }
})

export const memberReducer = memberSlice.reducer;
export const memberAction = memberSlice.actions;