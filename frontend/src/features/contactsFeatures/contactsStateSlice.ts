import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export interface contactsSliceInitState {
    contacts: {
        addedContacts: {
            [key: number]: string
        },
        blockedContacts: {
            [key: number]: string
        }
    }
}

export const addContact = createAsyncThunk('', async (args: { owner: string, contact: string }, thunkAPI) => {
    const { owner, contact } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/contacts/add', {
            'owner': owner,
            'contact': contact,
        }, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error })
    }
})

export const removeContact = createAsyncThunk('', async (args: { owner: string, contact: string }, thunkAPI) => {
    const { owner, contact } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/contacts/remove', {
            'owner': owner,
            'contact': contact,
        }, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error })
    }
})

export const blockContact = createAsyncThunk('', async (args: { owner: string, contact: string }, thunkAPI) => {
    const { owner, contact } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/contacts/block', {
            'owner': owner,
            'contact': contact,
        }, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error })
    }
})

export const unblockContact = createAsyncThunk('', async (args: { owner: string, contact: string }, thunkAPI) => {
    const { owner, contact } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.post('api/contacts/unblock', {
            'owner': owner,
            'contact': contact,
        }, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error })
    }
})


export const contactsSlice = createSlice({
    name: 'contactsSlice',
    initialState: {
        contacts: {
            addedContacts: {},
            blockedContacts: {},
        },
    } as contactsSliceInitState,
    reducers: {
        clearContactsState: (state) => {
            state.contacts = {
                addedContacts: {},
                blockedContacts: {},
            }
        },

        // addContact: (state, action) => {
        //     state.contacts[Object.keys(state.contacts).length] = action.payload.newContact
        // },

        // removeContact: (state, action) => {
        //     console.log(state.contacts[action.payload.optionsOnId])
        //     delete state.contacts[action.payload.optionsOnId]
        // },
    },

    extraReducers: (builder) => {
        builder
            .addCase(addContact.fulfilled, (state, action) => {
                state.contacts.addedContacts[Object.keys(state.contacts).length] = action.payload.addedContact
            })
            .addCase(removeContact.fulfilled, (state, action) => {
                delete state.contacts.addedContacts[action.payload.removedContact]
            })
            .addCase(blockContact.fulfilled, (state, action) => {
                state.contacts.blockedContacts[Object.keys(state.contacts).length] = action.payload.blockedContact
            })
            .addCase(unblockContact.fulfilled, (state, action) => {
                delete state.contacts.blockedContacts[action.payload.unblockedContact]
            })
    }
})


export const {
    clearContactsState,
} = contactsSlice.actions