import { createAsyncThunk, createSlice, Slice } from "@reduxjs/toolkit";
import socket from "../../webSocketsUtil/webSocketServer";
import moment from 'moment';
import { convertToMorseCode } from "../../contexts/SharedContext";
import axios from "axios";

export interface chatSliceInitState {
    chats: {
        [key: string]: { [key: string]: string }[],
    },
    openChat: {
        username: string,
        chat: { [key: string]: string }[] | [{}],
    },
    decryptMessageStatus: { [key: string]: string },
    decryptMessageText: { [key: string]: string },
    inboxStatus: { [key: string]: string },
    blockedStatus: string,
}


export const decryptMessage = createAsyncThunk('chatActionSlice/decryptMessage', async (args: { message: string, messageIndex: string }, thunkAPI,) => {
    const { message } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/chat/decryptMessage', {
            'message': message,
        }, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error })
    }
})

export const sendMessage = createAsyncThunk<any, any, { rejectValue: { reason: string, [key: string]: any } }>('chatActionSlice/sendMessage', async (args: { sender: { id: string, username: string }, recipient: string, message: string, isNewChat: boolean }, thunkAPI) => {

    const { sender, recipient, isNewChat, } = args

    const config = {
        headers: {
            "Content-type": "application/json",
            // add access token
        }
    }

    const { data } = await axios.get(`api/chat/checkBlock?sender=${sender.username}&recipient=${recipient}`, config)

    if (data.blocked) {
        return thunkAPI.rejectWithValue({ recipient: recipient, reason: 'blocked' })
    } else {
        if (isNewChat) {
            try {
                socket.emit('send-new-open-message', args)
                return args
            } catch (error) {
                alert('error')
                return thunkAPI.rejectWithValue({ error: error, reason: 'error' })
            }
        } else {
            try {
                socket.emit('send-new-message', args)
                return args
            } catch (error) {
                alert('error')
                return thunkAPI.rejectWithValue({ error: error, reason: 'error' })
            }
        }
    }
})



export const chatActionSlice: Slice = createSlice({
    name: 'chatActionSlice',
    initialState: {
        chats: {},
        openChat: {},
        decryptMessageStatus: {},
        decryptMessageText: {},
        inboxStatus: {},
        blockedStatus: '',
    } as chatSliceInitState,
    reducers: {
        clearChatState: (state) => {
            state.chats = {}
            state.openChat = {}
            state.decryptMessageStatus = {}
            state.inboxStatus = {}
            state.blockedStatus = ''
        },

        clearBlockedState: (state) => {
            state.blockedStatus = ''
        },

        openChatAction: (state, action) => {
            state.blockedStatus = ''
            state.openChat = { chat: action.payload.chat, username: action.payload.username }
            if (action.payload.username in state.inboxStatus) {
                delete state.inboxStatus[action.payload.username]
            }
        },


        blockChatFromOption: (state, action) => {
            state.openChat = { username: '', chat: [{}] }

            state.chats = {
                ...state.chats,
                [action.payload.recipient]: [
                    { [action.payload.sender]: 'This chat is blocked', time: moment().format('HH:mm') }
                ],
            }
            state.blockedStatus = `This chat is blocked by either you or by ${action.payload.recipient}`
        },

        handleReceivedOpenChat: (state, action) => {
            if (state.chats[action.payload.sender]) { // if chat with this sender already exists
                if (state.openChat.username && state.openChat.username !== action.payload.sender) { // the chat is opened, but not with this sender
                    state.inboxStatus[action.payload.sender] = "active"

                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            ...state.chats[action.payload.sender],
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }
                } else { // there is no open chat and this is a new request to open existing chat
                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            ...state.chats[action.payload.sender],
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }

                    state.openChat = {
                        username: action.payload.sender,
                        chat: [...state.openChat.chat, {
                            [action.payload.sender]: action.payload.message,
                            time: action.payload.time,
                        }]
                    }
                }
            } else { // chat with this sender doesn't exist
                if (state.openChat.username && state.openChat.username !== action.payload.sender) { // the chat is opened, but not with this sender
                    state.inboxStatus[action.payload.sender] = "active"

                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }
                } else { // there is no open chat and this is a new request to open existing chat
                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }

                    state.openChat = {
                        username: action.payload.sender,
                        chat: [{
                            [action.payload.sender]: action.payload.message,
                            time: action.payload.time,
                        }]
                    }
                }
            }
        },

        handleReceivedNewMessage: (state, action) => {

            if (state.chats[action.payload.sender]) { // if chat with this sender already exists
                if (state.openChat.username && state.openChat.username !== action.payload.sender) { // the chat is opened, but not with this sender
                    state.inboxStatus[action.payload.sender] = "active"

                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            ...state.chats[action.payload.sender],
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }
                } else { // there is no open chat and this is a new request to open existing chat
                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            ...state.chats[action.payload.sender],
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }

                    state.openChat = {
                        username: action.payload.sender,
                        chat: [...state.openChat.chat, {
                            [action.payload.sender]: action.payload.message,
                            time: action.payload.time,
                        }]
                    }
                }
            } else { // chat with this sender doesn't exist
                if (state.openChat.username && state.openChat.username !== action.payload.sender) { // the chat is opened, but not with this sender

                    state.inboxStatus[action.payload.sender] = "active"

                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }
                } else { // there is no open chat and this is a new request to open existing chat
                    state.chats = {
                        ...state.chats,

                        [action.payload.sender]: [
                            { [action.payload.sender]: action.payload.message, time: moment().format('HH:mm') }
                        ],
                    }

                    state.openChat = {
                        username: action.payload.sender,
                        chat: [{
                            [action.payload.sender]: action.payload.message,
                            time: action.payload.time,
                        }]
                    }
                }
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.fulfilled, (state, action) => {

                if (action.payload.isNewChat) { // "if this is a new chat"

                    state.chats = {
                        ...state.chats, // "preserve all other chats"

                        [action.payload.recipient]: [ // add new message to the *GENERAL* chat with the "<recipient>"
                            { [action.payload.sender.username]: convertToMorseCode(action.payload.message), time: moment().format('HH:mm') }
                        ],
                    }

                    state.openChat = {
                        username: action.payload.recipient, // <-- "who am I talking to (chat header)"

                        chat: [{ // add new message into the *OPEN* chat with the "<recipient>"
                            [action.payload.sender.username]: convertToMorseCode(action.payload.message),
                            time: moment().format('HH:mm'),
                        }],
                    }
                } else { // "chat with this user already exists"
                    if (state.openChat.username !== action.payload.recipient) { // "if chat with this user already exists, but is not the currently opened chat"
                        state.chats = {
                            ...state.chats, // preserve all other chats

                            [action.payload.recipient]: [ // add new message to the *GENERAL* chat with the "<recipient>"
                                ...state.chats[action.payload.recipient], // preserve all other messages
                                { [action.payload.sender.username]: convertToMorseCode(action.payload.message), time: moment().format('HH:mm') }
                            ],
                        }

                        state.openChat = {
                            username: action.payload.recipient, // change the header of the currently opened chat to this new username 

                            chat: [...state.chats[action.payload.recipient], // replace all messages in the currently opened chat with the messages of a different chat (identified by the username of the recipient)
                            ]
                        }
                    } else { // "chat with this user already exists and is the currently opened chat"
                        state.chats = {
                            ...state.chats,

                            [action.payload.recipient]: [ // add message to the *GENERAL* chat with the recipient
                                ...state.chats[action.payload.recipient],
                                { [action.payload.sender.username]: convertToMorseCode(action.payload.message), time: moment().format('HH:mm') }
                            ],
                        }

                        state.openChat = {
                            ...state.openChat,
                            ///@ts-ignore 
                            chat: [...state.openChat.chat, { // add message to the already existing *OPEN* chat
                                [action.payload.sender.username]: convertToMorseCode(action.payload.message),
                                time: moment().format('HH:mm'),
                            }],
                        }
                    }

                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                if (action.payload && action.payload.reason === 'blocked') {
                    state.openChat = { username: '', chat: [{}] }

                    state.chats = {
                        ...state.chats,
                        [action.meta.arg.recipient]: [
                            { [action.meta.arg.sender.username]: 'This chat is blocked', time: moment().format('HH:mm') }
                        ],
                    }
                    state.blockedStatus = `This chat is blocked either by you or by ${action.payload.recipient}`
                }
            })
            .addCase(decryptMessage.pending, (state, { meta }) => {
                state.decryptMessageStatus = { ...state.decryptMessageStatus, [meta.arg.messageIndex]: 'pending' }
            })
            .addCase(decryptMessage.fulfilled, (state, action) => {
                state.decryptMessageStatus = { ...state.decryptMessageStatus, [action.meta.arg.messageIndex]: '' }
                state.decryptMessageText = { ...state.decryptMessageText, [action.meta.arg.messageIndex]: action.payload.message }
            })
            .addCase(decryptMessage.rejected, (state, action) => {
                /// @ts-ignore
                state.decryptMessageStatus = { ...state.decryptMessageStatus, [action.meta.arg.messageIndex]: action.payload.error.response.data.error ? action.payload.error.response.data.error : action.payload.error.message }
            })
    }
})


export const {
    openChatAction,
    clearChatState,
    clearBlockedState,
    blockChatFromOption,
    handleReceivedOpenChat,
    handleReceivedNewMessage,
} = chatActionSlice.actions