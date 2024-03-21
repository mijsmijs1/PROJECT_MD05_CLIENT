import { createSlice } from "@reduxjs/toolkit";
import { user } from "./authen.slice";
type AvailableStatus = "active" | "inactive"
type addModal = true | false
export type course_access = {
    id: number;
    userId: number;
    createAt: string;
    updateAt: string;
    courseId: number;
}

export type log = {
    id: number;
    memberId: number;
    note: string;
    createTime: string;
    userId: number;
}


interface InitState {
    userProduct: user | null,
    addModal: addModal,
    list :user[]

}
let initialState: InitState = {
    userProduct: null,
    addModal: false,
    list:[]
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserProduct: (state, action) => {
            state.userProduct = action.payload;
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        adduser: (state, action) => {
            state.list.unshift(action.payload)
        },
        update: (state, action) => {
            state.list = state.list.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },setList: (state, action) => {
            state.list = action.payload
        }
    }
})
export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;