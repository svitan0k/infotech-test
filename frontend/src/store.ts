import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { chatActionSlice, } from "./features/chatFeatures/chatStateSlice";
import { contactsSlice, } from "./features/contactsFeatures/contactsStateSlice";
import { userInfoSlice } from "./features/userInfoFeatures/userInfoStateSlice";
import webSocketMiddleware from "./reduxMiddleware/webSocketMiddleware";


const reducer = {
    userInfo: userInfoSlice.reducer,
    chatsSlice: chatActionSlice.reducer,
    contactsSlice: contactsSlice.reducer,
}

const store = configureStore({
    reducer,
    // preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(webSocketMiddleware)
})

export type RootState = ReturnType<typeof store.getState>

export default store