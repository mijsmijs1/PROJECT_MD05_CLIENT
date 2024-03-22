import { Chat } from "@/sokets/chat.socket";
import { createSlice } from "@reduxjs/toolkit";





interface ChatInitState {
    data: null | Chat[],
    loading: boolean
}

let initialState: ChatInitState = {
    data: null,
    loading: false
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setData(state, action) {
            state.data = action.payload
        }
    }
})

export const chatReducer = chatSlice.reducer;
export const chatAction = {
    ...chatSlice.actions
};


