import { api } from "@/services/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export type AvailableStatus = "active" | "inactive"
export type ProductStatus = "active" | "inactive" | "done" | "delete" | "deny"
export type TradeMethod = "news" | "payment"

export type Product = {
    id: number;
    name: string;
    price: number;
    moderationStatus: AvailableStatus;
    status: ProductStatus;
    method: TradeMethod;
    createAt: string;
    postAt: string;
    updateAt: string;
    desc: string;
    detail: string;
    address: string;
    priorityStatus: AvailableStatus;
    priorityTimeLine?: string;
    avatar: string;
    videoUrl: string;
    branchId: number;
    userId?: number;
    userName?: string;
    userAvatar?: string;
    imgs: Img[];
}
export type Img = {
    id: number;
    imgUrl: string;
    createAt: string;
    updateAt: string;
    productId: number;
}
interface Initial {
    product: Product[] | null,
    addModal: boolean,
    productInfo: Product | null
}
const initialState: Initial = {
    product: null,
    addModal: false,
    productInfo: null
}
export const fetchProductData = createAsyncThunk(
    'product/fetchData',
    async () => {
        try {
            let res = await api.product.getProduct()
            return res.data.data
        } catch (err) {

        }

    }
)
const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.product = action.payload;
        },
        setProductInfo: (state, action) => {
            state.productInfo = action.payload;
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        update: (state, action) => {
            state.product = state.product.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        }
    }, extraReducers: (builder) => {
        builder.addCase(fetchProductData.fulfilled, (state, action) => {
            state.product = action.payload
        })
    }
})
export const productReducer = productSlice.reducer;
export const productAction = productSlice.actions