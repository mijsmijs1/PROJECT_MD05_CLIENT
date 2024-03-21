import { combineReducers } from "redux";
import { authenReducer, fetchUserData } from "./slices/authen.slice";
import { configureStore } from "@reduxjs/toolkit";
import { memberReducer } from "./slices/member.slice";
import { chatReducer } from "./slices/chat.slice";
import { userReducer } from "./slices/user.slice";
import { categoryReducer, fetchCategories } from "./slices/category.slice";
import { fetchProductData, productReducer } from "./slices/product.slice";
import { receiptReducer } from "./slices/receipt.slice";
import { newsReducer } from "./slices/news.slice";

const AppReducer = combineReducers({
    authenStore: authenReducer,
    memberStore: memberReducer,
    chatStore:chatReducer,
    userStore: userReducer,
    categoryStore:categoryReducer,
    productStore: productReducer,
    receiptStore: receiptReducer,
    newsStore: newsReducer
})

export type Store = ReturnType<typeof AppReducer>;
export const store = configureStore({
    reducer: AppReducer
})
store.dispatch(fetchUserData())
store.dispatch(fetchCategories())
store.dispatch(fetchProductData())