import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export interface userResult {
    user_id: string,
    username: string,
    tokenID: string,
    expires: string,
}

export interface userInfoInitState {
    userInfo: {
        username: string | null,
        token: string | null,
    },

    auxiliaryState: {
        [key: string]: boolean | string,
    }
}

export const loginUser = createAsyncThunk('userInfoSlice/loginUser', async (args: { username: string, password: string }, thunkAPI) => {
    const { username, password } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/users/login', {
            'username': username,
            'password': password,
        }, config) as { data: { result: userResult } }

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error)
    }
})




export const registerUser = createAsyncThunk('userInfoSlice/registerUser', async (args: {
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
            'username': username,
            'password': password,
            'role': role,
        }, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error })
    }
})




export const userInfoSlice = createSlice({
    name: 'userInfoSlice',
    initialState: {
        userInfo: {
            username: sessionStorage.getItem('username') || null,
            token: sessionStorage.getItem('token') || null,
        },
        auxiliaryState: {
            submitButtonTimeout: false,
            serverError: '',
        }
    } as userInfoInitState,
    reducers: {
        userLogout: (state) => {
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('token')
            state.userInfo.username = null
            state.userInfo.token = null
        }
    },
    extraReducers: (builder) => {
        builder
            // user login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.auxiliaryState.submitButtonTimeout = false

                sessionStorage.setItem('username', action.payload.result.username)
                sessionStorage.setItem('token', action.payload.result.tokenID)

                state.userInfo.username = action.payload.result.username
                state.userInfo.token = action.payload.result.tokenID
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log(action.payload)
                /// @ts-ignore -- too much headache trying to type AxiosError which can only be of two types(my custom "error" sent from the server and axios "message" error), I would consider both covered by the expression below.
                state.auxiliaryState.serverError = action.payload.error.response.data.error ? action.payload.error.response.data.error : action.payload.error.message
                state.auxiliaryState.submitButtonTimeout = false
            })

            // user register
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log(action.payload)

                sessionStorage.setItem('username', action.payload.result.username)
                sessionStorage.setItem('token', action.payload.result.tokenID)

                state.userInfo.username = action.payload.result.username
                state.userInfo.token = action.payload.result.tokenID
            })
            .addCase(registerUser.rejected, (state, action) => {
                console.log(action.payload)
                /// @ts-ignore -- too much headache trying to type AxiosError which can only be of two types(my custom "error" sent from the server and axios "message" error), I would consider both covered by the expression below.
                state.auxiliaryState.serverError = action.payload.error.response.data.error ? action.payload.error.response.data.error : action.payload.error.message
                state.auxiliaryState.submitButtonTimeout = false
            })
    }
})


export const {
    userLogout
} = userInfoSlice.actions