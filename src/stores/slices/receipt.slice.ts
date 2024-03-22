

import {  createSlice } from "@reduxjs/toolkit";
const receiptSlice = createSlice({
    name: "receipt",
    initialState: {
        cart: null,
        receipts: [],
        allReceipts: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload
        },
        setReceipt: (state, action) => {
            state.receipts = action.payload
        },
        setAll: (state, action) => {
            state.allReceipts = action.payload
        },
        deleteItem: (state, action) => {
            state.cart = {
                ...state.cart,
                detail: state.cart.detail.filter(item => item.id != action.payload)
            }
        },
        updateItem: (state, action) => {
            state.cart = {
                ...state.cart,
                detail: state.cart.detail.map(item => {
                    if (item.id == action.payload.itemId) {
                        return {
                            ...item,
                            quantity: action.payload.quantity
                        }
                    }
                    return item
                })
            }
        },
        update: (state, action) => {
            state.receipts = state.receipts.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },
        addReceipt: (state, action) => {
            state.receipts.unshift(action.payload)
        }
    }
})

export const receiptReducer = receiptSlice.reducer;
export const receiptAction = receiptSlice.actions;