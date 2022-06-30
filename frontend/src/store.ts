import { configureStore } from "@reduxjs/toolkit";
import { chatActionSlice } from "./features/chatFeatures/chatActions";

const reducer = {
    chats: chatActionSlice.reducer,
}

const store = configureStore({
    reducer,
})


export default store