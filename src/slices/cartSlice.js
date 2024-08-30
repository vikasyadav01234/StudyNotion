import { createSlice } from "@reduxjs/toolkit";
import {toast} from 'react-hot-toast'
import { setToken } from "./authSlice";

const initialState={
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")):0
};
const cartSlice = createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        setTotalItemss(state, value){
            state.token = value.payload;
        },
    },
});

export const {setTotalItemss} = cartSlice.actions;

export default cartSlice.reducer;