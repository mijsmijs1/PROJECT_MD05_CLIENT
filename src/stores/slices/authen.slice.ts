import { api } from "@/services/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export type AvailableStatus = "active" | "inactive"
export type TradeStatus = "store" | "personal"
export type user = {
    id: number;
    userName: string;
    password: string;
    avatar: string;
    email: string;
    emailConfirm: AvailableStatus;
    phoneNumber: string;
    phoneConfirm: AvailableStatus;
    wallet: number;
    status: boolean;
    createAt: string;
    updateAt: string;
    lastLogin: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    storeTimeLine?: string;
    tradeStatus: TradeStatus;
    priorityNewsCount?: number;
    loginStatus: AvailableStatus;
}
interface InitialState {
    data: user | null
}
const initialState: InitialState = {
    data: null
}
export const fetchUserData = createAsyncThunk(
    'users/fetchByIdStatus',
    async () => {
        try {
            const result = await api.authen.decodeToken(localStorage.getItem('token'))
            return result.data.data
        } catch (err) {
            localStorage.removeItem('token')
        }

    }
)

const authenSlice = createSlice({
    name: "authen",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            // Add user to the state array
            state.data = action.payload
        })
    }
})

export const authenReducer = authenSlice.reducer;
export const authenAction = authenSlice.actions;