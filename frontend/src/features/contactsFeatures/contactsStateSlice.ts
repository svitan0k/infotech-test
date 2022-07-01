import { createSlice } from "@reduxjs/toolkit";


export interface contactsSliceInitState {
    contacts: {
        [key: number]: string
    }
}


export const contactsSlice = createSlice({
    name: 'contactsSlice',
    initialState: {
        contacts: [],
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
})


export const {
    addContact,
    removeContact,
} = contactsSlice.actions