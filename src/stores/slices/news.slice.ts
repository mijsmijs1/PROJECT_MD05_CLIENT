import { createSlice } from "@reduxjs/toolkit";

const newsSlice = createSlice({
    name: "news",
    initialState: {
        cart: null,
        newss: [],
        allnewss: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload
        },
        setnews: (state, action) => {
            state.newss = action.payload
        },
        setAll: (state, action) => {
            state.allnewss = action.payload
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
            state.newss = state.newss.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },
        addnews: (state, action) => {
            state.newss.unshift(action.payload)
        }
    }
})

export const newsReducer = newsSlice.reducer;
export const newsAction = newsSlice.actions;