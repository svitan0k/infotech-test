import { createAsyncThunk, createSlice, Slice } from "@reduxjs/toolkit";
import socket from "../../webSocketsUtil/webSocketServer";


export interface chatSliceInitState {
    chats: {
        [key: string]: { [key: string]: string }[],
    },
    openChat: {
        username: string,
        chat: { [key: string]: string }[],
    },
}


export const sendMessage = createAsyncThunk('', async (args: { sender: string, recipient: string, message: string }, thunkAPI) => {
    // const { sender, recipient, message } = args

    try {
        socket.emit('send-new-message', args)
        alert('sent new message')
        return;
    } catch (error) {
        alert('error')
        console.log(error)
        return thunkAPI.rejectWithValue(error)
    }
})



export const chatActionSlice: Slice = createSlice({
    name: 'chatActionSlice',
    initialState: {
        chats: {},
        openChat: {},
    } as chatSliceInitState,
    reducers: {
        // addChat: (state, action) => {
        //     state.chats[action.payload.chatWithUsername] = [...state.chats[action.payload.chatWithUsername], action.payload.usernmaeAndMessage]
        // },
        openChat: (state, action) => {
            console.log(action.payload)
            state.openChat = { chat: action.payload.chat, username: action.payload.username }
        },
        handleReceivedOpenChat: (state, action) => {
            state.openChat = {
                username: action.payload.sender,
                chat: [{
                    message: action.payload.message,
                    time: action.payload.time,
                }]
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.fulfilled, (state, action) => {

            })
    }
})


export const {
    addChat,
    openChat,
    handleReceivedOpenChat,
} = chatActionSlice.actions