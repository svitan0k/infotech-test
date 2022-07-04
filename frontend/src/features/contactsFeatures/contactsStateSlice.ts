import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { blockChatFromOption, } from "../chatFeatures/chatStateSlice";


export interface contactsSliceInitState {
    contacts: {
        addedContacts: string[],
        blockedContacts: string[],
    },
    contactsError: string,
}

export const getContacts = createAsyncThunk<any, any, {rejectValue: AxiosError}>('contactsSlice/getContacts', async (args: {username: string}, thunkAPI) => {
    const { username } = args

    const config = {
        headers: {
            "Content-type": "application/json",
            // add token validation,
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
            // add token validation
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

        thunkAPI.dispatch(blockChatFromOption({sender: owner, recipient: contact}))

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
    initialState: {
        contacts: (sessionStorage.getItem('contacts') && JSON.parse(sessionStorage.getItem('contacts')!)) || {
            addedContacts: [],
            blockedContacts: [],
        },
        contactsError: '',
    } as contactsSliceInitState,
    reducers: {
        clearContactsState: (state) => {
            state.contacts = {
                addedContacts: [],
                blockedContacts: [],
            }
            if (sessionStorage.getItem('contacts')) {
                sessionStorage.removeItem('contacts')
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getContacts.fulfilled, (state, action) => {
                sessionStorage.setItem('contacts', JSON.stringify({addedContacts: action.payload.addedContacts, blockedContacts: action.payload.blockedContacts}))
                state.contacts.addedContacts = [...action.payload.addedContacts]
                state.contacts.blockedContacts = [...action.payload.blockedContacts]
            })
            .addCase(getContacts.rejected, (state, action) => {
                if (action.payload) {
                    state.contactsError = action.payload.message
                }
            })
            .addCase(addContact.fulfilled, (state, action) => {
                state.contacts.addedContacts = [...state.contacts.addedContacts, action.payload.addedContact]

                // persist to sessionStorage
                sessionStorage.setItem('contacts', JSON.stringify({addedContacts: [...state.contacts.addedContacts], blockedContacts: [...state.contacts.blockedContacts]}))
            })
            
            .addCase(removeContact.fulfilled, (state, action) => {
                state.contacts.addedContacts = state.contacts.addedContacts.filter((contact) => contact !== action.payload.removedContact)

                // persist to sessionStorage
                sessionStorage.setItem('contacts', JSON.stringify({addedContacts: [...state.contacts.addedContacts], blockedContacts: [...state.contacts.blockedContacts]}))
            })
            
            .addCase(blockContact.fulfilled, (state, action) => {
                state.contacts.addedContacts = state.contacts.addedContacts.filter((contact) => contact !== action.payload.blockedContact)
                state.contacts.blockedContacts = [...state.contacts.blockedContacts, action.payload.blockedContact]

                // persist to sessionStorage
                sessionStorage.setItem('contacts', JSON.stringify({addedContacts: [...state.contacts.addedContacts], blockedContacts: [...state.contacts.blockedContacts]}))
            })

            .addCase(unblockContact.fulfilled, (state, action) => {
                state.contacts.blockedContacts = state.contacts.blockedContacts.filter((contact) => contact !== action.payload.unblockedContact)
                state.contacts.addedContacts = [...state.contacts.addedContacts, action.payload.unblockedContact]

                // persist to sessionStorage
                sessionStorage.setItem('contacts', JSON.stringify({addedContacts: [...state.contacts.addedContacts], blockedContacts: [...state.contacts.blockedContacts]}))
            })
    }
})


export const {
    clearContactsState,
} = contactsSlice.actions