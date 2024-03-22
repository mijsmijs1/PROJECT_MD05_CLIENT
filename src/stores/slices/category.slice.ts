import { api } from "@/services/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export type AvailableStatus = "active" | "inactive"
export type Category = {
    id: number;
    name: string;
    codeName: string;
    avatar: String;
    createAt: string;
    updateAt: String;
    status: AvailableStatus
    branches: Branch[]
}
export type Branch = {
    id: number;
    name: string;
    codeName: string;
    createAt: string;
    updateAt: String;F
    status: AvailableStatus;
    categoryId: number
}

interface InitState {
    category: Category[] | null;
    addModal: boolean,
    branch: Branch[]
}
const initialState: InitState = {
    category: null,
    addModal: false,
    branch: null
}
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async () => {
        try {
            const result = await api.category.findCategory()
            return result.data.data
        } catch (err) {

        }
    })
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.category = action.payload
        },
        addData: (state, action) => {
            state.category.unshift(action.payload)
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        update: (state, action) => {
            state.category = state.category.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },
        setBranch: (state, action) => {
            state.branch = action.payload
        },
        addBranch: (state, action) => {
            state.branch.unshift(action.payload)
        },
        updateBranch: (state, action) => {
            state.branch = state.branch.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        }
    },
    extraReducers(builder) {

        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.category = action.payload;
        })
    },
})
export const categoryAction = categorySlice.actions
export const categoryReducer = categorySlice.reducer

