import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { chatActionSlice, chatSliceInitState } from "./features/chatFeatures/chatStateSlice";
import { contactsSlice, contactsSliceInitState } from "./features/contactsFeatures/contactsStateSlice";
import { userInfoInitState, userInfoSlice } from "./features/userInfoFeatures/userInfoStateSlice";
import webSocketMiddleware from "./reduxMiddleware/webSocketMiddleware";


const reducer = {
    userInfo: userInfoSlice.reducer,
    chatsSlice: chatActionSlice.reducer,
    contactsSlice: contactsSlice.reducer,
}

const preloadedState = {
    userInfo: {
        userInfo: {
            user_id: sessionStorage.getItem('user_id') || null,
            username: sessionStorage.getItem('username') || null,
            token: sessionStorage.getItem('token') || null,
            role: sessionStorage.getItem('role') || null,
        },
        
        auxiliaryState: {
            submitButtonTimeout: false,
            serverError: '',
        }
    } as userInfoInitState,

    chatsSlice: {
        chats: {
            Sam: [
                { username1: "hello there", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username2: "yes, hello", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username1: "How are you?", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username1: "doing fine?", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username2: "yeah, I'm good", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
            ],
            Lucky_guy: [
                { username1: "hello there", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username2: "yes, hello", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username1: "How are you?", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username1: "doing fine?", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username2: "yeah, I'm good", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
            ],
        },
        openChat: {
            username: "some dude",
            
            chat: [
                { username1: "hello there", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username2: "yes, hello", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username1: "How are you?", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username1: "doing fine?", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
                { username2: "yeah, I'm good", time: new Date(Date.now()).getHours().toString() + ":" + new Date(Date.now()).getMinutes().toString()},
            ],
        },

        decryptMessageStatus: ''
    } as chatSliceInitState,

    contactsSlice: {
        contacts: {
            0: 'Sam',
            1: 'Alex',
            2: 'Ivan',
            3: 'Masha',
        }
    } as contactsSliceInitState,
}

const store = configureStore({
    reducer,
    // preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(webSocketMiddleware)
})

export type RootState = ReturnType<typeof store.getState>

export default store