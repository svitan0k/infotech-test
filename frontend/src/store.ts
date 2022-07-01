import { configureStore } from "@reduxjs/toolkit";
import { chatActionSlice, chatSliceInitState } from "./features/chatFeatures/chatStateSlice";
import { contactsSlice, contactsSliceInitState } from "./features/contactsFeatures/contactsStateSlice";
import { userInfoInitState, userInfoSlice } from "./features/userInfoFeatures/userInfoStateSlice";


const reducer = {
    userInfo: userInfoSlice.reducer,
    chatsSlice: chatActionSlice.reducer,
    contactsSlice: contactsSlice.reducer,
}

const preloadedState = {
    userInfo: {
        userInfo: {
            username: sessionStorage.getItem('username') || null,
            token: sessionStorage.getItem('token') || null
        },
        
        auxiliaryState: {
            submitButtonTimeout: false,
            serverError: '',
        }
    } as userInfoInitState,

    chatsSlice: {
        chats: {
            Sam: [
                { username1: "hello there" },
                { username2: "yes, hello" },
                { username1: "How are you?" },
                { username1: "doing fine?" },
                { username2: "yeah, I'm good" },
            ],
            Lucky_guy: [
                { username1: "hello there" },
                { username2: "yes, hello" },
                { username1: "How are you?" },
                { username1: "doing fine?" },
                { username2: "yeah, I'm ok" },
            ],
            SomeUserWow: [
                { username1: "hello there" },
                { username2: "yes, hello" },
                { username1: "How are you?" },
                { username1: "doing fine?" },
                { username2: "It's going slow" },
            ],
        },
        openChat: {
            username: "some dude",
            
            chat: [
                { username1: "hello there" },
                { username2: "yes, hello" },
                { username1: "How are you?" },
                { username1: "doing fine?" },
                { username2: "yeah, I'm good" },
            ],
        },
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
    preloadedState,
})

export type RootState = ReturnType<typeof store.getState>

export default store