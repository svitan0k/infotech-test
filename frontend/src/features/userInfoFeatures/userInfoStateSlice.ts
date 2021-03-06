import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import socket from "../../webSocketsUtil/webSocketServer";
import { getContacts } from "../contactsFeatures/contactsStateSlice";


export interface userResult {
    user_id: string,
    username: string,
    tokenID: string,
    role: string,
    expires: string,
}

export interface userInfoInitState {
    userInfo: {
        user_id: string | null,
        username: string | null,
        token: string | null,
        role: string | null,
    },

    auxiliaryState: {
        [key: string]: boolean | string,
    }
}

type ServerError = { error: string }

export const loginUser = createAsyncThunk<any, any, { rejectValue: AxiosError<ServerError> }>('userInfoSlice/loginUser', async (args: { username: string, password: string }, thunkAPI) => {
    const { username, password } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/users/login', {
            'username': username.trim(),
            'password': password,
        }, config) as { data: { result: userResult } }

        
        if (data.result.user_id) {
            thunkAPI.dispatch(getContacts({ username }))
        }

        return data
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError<ServerError>
            if (serverError && serverError.response) {
                return thunkAPI.rejectWithValue(serverError)
            }
        } else {
            return thunkAPI.rejectWithValue(error)
        }
    }
})




export const registerUser = createAsyncThunk<any, any, { rejectValue: AxiosError<ServerError> }>('userInfoSlice/registerUser', async (args: {
    username: string, password: string, role: string,
}, thunkAPI) => {

    const { username, password, role } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/users/register', {
            'username': username.trim(),
            'password': password,
            'role': role,
        }, config)

        return data
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError<ServerError>
            if (serverError && serverError.response) {
                return thunkAPI.rejectWithValue(serverError)
            }
        } else {
            return thunkAPI.rejectWithValue(error)
        }
    }
})




export const userInfoSlice = createSlice({
    name: 'userInfoSlice',
    initialState: {
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
    reducers: {
        userLogout: (state) => {
            sessionStorage.removeItem('user_id')
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('role')
            state.userInfo.user_id = null
            state.userInfo.username = null
            state.userInfo.token = null
            state.userInfo.role = null
            state.auxiliaryState.submitButtonTimeout = false
        },

        connectToWebSocket: (state) => {
            socket.auth = { client: { user_id: state.userInfo.user_id, username: state.userInfo.username, token: state.userInfo.token } }
            socket.connect()
        }
    },
    extraReducers: (builder) => {
        builder
            // user login
            .addCase(loginUser.pending, (state) => {
                state.auxiliaryState.serverError = ''
                state.auxiliaryState.submitButtonTimeout = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.auxiliaryState.submitButtonTimeout = false

                // sessionStorage is needed to keep user logged in if the page is refreshed(redux state gets wiped out) 
                sessionStorage.setItem('user_id', action.payload.result.user_id)
                sessionStorage.setItem('username', action.payload.result.username)
                sessionStorage.setItem('token', action.payload.result.tokenID)
                sessionStorage.setItem('role', action.payload.result.role)

                state.userInfo.user_id = action.payload.result.user_id
                state.userInfo.username = action.payload.result.username
                state.userInfo.token = action.payload.result.tokenID
                state.userInfo.role = action.payload.result.role
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.auxiliaryState.submitButtonTimeout = false

                if (action.payload && action.payload.response && action.payload.response.data) {
                    state.auxiliaryState.serverError = action.payload.response.data.error ? action.payload.response.data.error : action.payload.message
                } else {
                    state.auxiliaryState.serverError = 'There was an error, please try again later.'
                }
            })



            // user register
            .addCase(registerUser.pending, (state) => {
                state.auxiliaryState.serverError = ''
                state.auxiliaryState.submitButtonTimeout = true
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                sessionStorage.setItem('user_id', action.payload.result.user_id)
                sessionStorage.setItem('username', action.payload.result.username)
                sessionStorage.setItem('token', action.payload.result.tokenID)
                sessionStorage.setItem('role', action.payload.result.role)

                state.userInfo.user_id = action.payload.result.user_id
                state.userInfo.username = action.payload.result.username
                state.userInfo.token = action.payload.result.tokenID
                state.userInfo.role = action.payload.result.role
            })
            .addCase(registerUser.rejected, (state, action) => {

                state.auxiliaryState.submitButtonTimeout = false

                if (action.payload && action.payload.response && action.payload.response.data) {
                    state.auxiliaryState.serverError = action.payload.response.data.error ? action.payload.response.data.error : action.payload.message
                } else {
                    state.auxiliaryState.serverError = 'There was an error, please try again later.'
                }
            })
    }
})


export const {
    userLogout,
    connectToWebSocket,
} = userInfoSlice.actions