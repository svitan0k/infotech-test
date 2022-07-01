import { createSlice, Slice } from "@reduxjs/toolkit";


export interface chatSliceInitState {
    chats: {
        [key: string]: { [key: string]: string }[],
    },
    openChat: {
        username: string,
        chat: { [key: string]: string }[],
    },
}



export const chatActionSlice: Slice = createSlice({
    name: 'chatActionSlice',
    initialState: {
        chats: {},
        openChat: {},
    } as chatSliceInitState,
    reducers: {
        addChat: (state, action) => {
            state.chats[action.payload.chatWithUsername] = [...state.chats[action.payload.chatWithUsername], action.payload.usernmaeAndMessage]
        },
        openChat: (state, action) => {
            console.log(action.payload)
            state.openChat = {chat: action.payload.chat, username: action.payload.username}
        },
        sendMessage: (state, action) => {

        }
    },
})


export const {
    addChat,
    openChat,
    sendMessage,
} = chatActionSlice.actions