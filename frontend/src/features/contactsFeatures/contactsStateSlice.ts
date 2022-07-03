import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export interface contactsSliceInitState {
    contacts: {
        [key: number]: string
    }
}


export const blockContact = createAsyncThunk('', async (args: {username: string}, thunkAPI) => {
    const {username} = args
})


export const contactsSlice = createSlice({
    name: 'contactsSlice',
    initialState: {
        contacts: {},
    } as contactsSliceInitState,
    reducers: {
        addContact: (state, action) => {
            state.contacts[Object.keys(state.contacts).length] = action.payload.newContact
        },

        removeContact: (state, action) => {
            console.log(state.contacts[action.payload.optionsOnId])
            delete state.contacts[action.payload.optionsOnId]
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(blockContact.fulfilled, (state, action) => {

        })
    }
})


export const {
    addContact,
    removeContact,
} = contactsSlice.actions