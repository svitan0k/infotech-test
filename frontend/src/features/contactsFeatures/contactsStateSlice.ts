import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { v4 as uuid } from 'uuid';


export interface contactsSliceInitState {
    contacts: {
        addedContacts: {
            [key: number]: string
        },
        blockedContacts: {
            [key: number]: string
        }
    },
    contactsError: string,
}

export const getContacts = createAsyncThunk<any, any, {rejectValue: AxiosError}>('contactsSlice/getContacts', async (args: {username: string}, thunkAPI) => {
    const { username } = args

    const config = {
        headers: {
            "Content-type": "application/json",
            // token validation,
        }
    }

    try {
        const { data } = await axios.get(`api/contacts/get?owner=${username}`, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue( error )
    }
})

export const addContact = createAsyncThunk('contactsSlice/addContact', async (args: { owner: string, contact: string }, thunkAPI) => {
    const { owner, contact } = args

    const config = {
        headers: {
            "Content-type": "application/json",
            // token validation
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

export const removeContact = createAsyncThunk('contactsSlice/removeContact', async (args: { owner: string, contact: string }, thunkAPI) => {
    const { owner, contact } = args

    const config = {
        headers: {
            "Content-type": "application/json",
        }
    }

    try {
        const { data } = await axios.delete(`api/contacts/remove?owner=${owner}&contact=${contact}`, config)

        return data
    } catch (error: any) {
        return thunkAPI.rejectWithValue({ error })
    }
})

export const blockContact = createAsyncThunk('contactsSlice/blockContact', async (args: { owner: string, contact: string }, thunkAPI) => {
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

export const unblockContact = createAsyncThunk('contactsSlice/unblockContact', async (args: { owner: string, contact: string }, thunkAPI) => {
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
    initialState: JSON.parse(sessionStorage.getItem('contacts')!) || {
        contacts: {
            addedContacts: {},
            blockedContacts: {},
        },
        contactsError: '',
    } as contactsSliceInitState,
    reducers: {
        clearContactsState: (state) => {
            state.contacts = {
                addedContacts: {},
                blockedContacts: {},
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getContacts.fulfilled, (state, action) => {
                console.log(action.payload)
                sessionStorage.setItem('contacts', JSON.stringify({addedContacts: action.payload.addedContacts, blockedContacts: action.payload.blockedContacts}))
                state.contacts.addedContacts = {...action.payload.addedContacts}
                state.contacts.blockedContacts = {...action.payload.blockedContacts}
            })
            .addCase(getContacts.rejected, (state, action) => {
                if (action.payload) {
                    state.contactsError = action.payload.message
                }
            })
            .addCase(addContact.fulfilled, (state, action) => {
                state.contacts.addedContacts[uuid()] = action.payload.addedContact
            })
            .addCase(removeContact.fulfilled, (state, action) => {
                delete state.contacts.addedContacts[+(Object.keys(state.contacts.addedContacts).find((key) => {
                    return state.contacts.addedContacts[+key] === action.payload.removedContact ? key : null
                }))!]
            })
            .addCase(blockContact.fulfilled, (state, action) => {
                delete state.contacts.addedContacts[+(Object.keys(state.contacts.addedContacts).find((key) => {
                    return state.contacts.addedContacts[+key] === action.payload.blockedContact ? key : null
                }))!]
                state.contacts.blockedContacts[uuid()] = action.payload.blockedContact
            })
            .addCase(unblockContact.fulfilled, (state, action) => {
                delete state.contacts.blockedContacts[+(Object.keys(state.contacts.blockedContacts).find((key) => {
                    return state.contacts.blockedContacts[+key] === action.payload.unblockedContact ? key : null
                }))!]
                state.contacts.addedContacts[uuid()] = action.payload.unblockedContact
            })
    }
})


export const {
    clearContactsState,
} = contactsSlice.actions