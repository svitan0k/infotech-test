import React, { useContext, useEffect, useState } from 'react'
import { IconButton, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, } from '@mui/material'
import { MoreVert, } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { blockContact, removeContact, unblockContact, } from '../features/contactsFeatures/contactsStateSlice'
import { shareContext } from '../contexts/SharedContext'



interface ContactsViewTS {
    handleOptionChange: Function,
}


const ContactsView: React.FC<ContactsViewTS> = ({ handleOptionChange }) => {

    const dispatch = useDispatch<any>()

    const { passedUsername, setPassedUsername } = useContext(shareContext)

    const { contacts } = useSelector((state: RootState) => state.contactsSlice)
    const { userInfo } = useSelector((state: RootState) => state.userInfo)

    const [openMoreAddedOptions, setOpenMoreAddedOptions] = useState<HTMLElement | null>(null)
    const [openMoreBlockedOptions, setOpenMoreBlockedOptions] = useState<HTMLElement | null>(null)
    const [optionsOnId, setOptionsOnId] = useState<number | null>(null)

    const addedOptionsOpen = Boolean(openMoreAddedOptions)
    const blockedOptionsOpen = Boolean(openMoreBlockedOptions)


    useEffect(() => {
        if (passedUsername) {
            handleOptionChange('send')
        }
    }, [passedUsername, handleOptionChange])



    // for added contacts
    const handleAddedContactsOptions = (currentTarget: any, contactId: number) => {
        setOpenMoreAddedOptions(currentTarget)
        setOptionsOnId(contactId)
    }

    const handleRemoveContact = () => {
        if (userInfo.username) {
            dispatch(removeContact({ owner: userInfo.username, contact: contacts.addedContacts[optionsOnId!] }))
        }
        setOpenMoreAddedOptions(null)
    }

    const handleBlockUser = () => {
        if (userInfo.username) {
            dispatch(blockContact({ owner: userInfo.username, contact: contacts.addedContacts[optionsOnId!] }))
        }
        setOpenMoreAddedOptions(null)
    }

    const handleSendNewMessage = async () => {
        setPassedUsername(contacts.addedContacts[optionsOnId!])
    }



    // for blocked contacts
    const handleBlockedContactsOptions = (currentTarget: any, contactId: number) => {
        setOpenMoreBlockedOptions(currentTarget)
        setOptionsOnId(contactId)
    }

    const handleUnblockUsed = () => {
        if (userInfo.username) {
            dispatch(unblockContact({ owner: userInfo.username, contact: contacts.blockedContacts[optionsOnId!] }))
        }
        setOpenMoreBlockedOptions(null)
    }

    return (
        <>
            {contacts && (contacts.addedContacts.length + contacts.blockedContacts.length) > 0 ?
                <>
                    <Menu
                        anchorEl={openMoreAddedOptions}
                        open={addedOptionsOpen}
                        onClose={() => setOpenMoreAddedOptions(null)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => handleSendNewMessage()}>
                            Send message
                        </MenuItem>
                        <MenuItem onClick={() => handleRemoveContact()}>
                            Remove from contacts
                        </MenuItem>
                        <MenuItem onClick={() => handleBlockUser()} >
                            Block
                        </MenuItem>
                    </Menu>

                    <Menu
                        anchorEl={openMoreBlockedOptions}
                        open={blockedOptionsOpen}
                        onClose={() => setOpenMoreBlockedOptions(null)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => handleUnblockUsed()}>
                            Unblock user
                        </MenuItem>
                    </Menu>


                    {Object.keys(contacts).map((contactType: string, contactsTypeIndex: number) => {
                        if (contactType === 'addedContacts') {
                            return (
                                <List subheader={
                                    <ListSubheader>
                                        Your contacts:
                                    </ListSubheader>
                                } key={contactsTypeIndex}>
                                    {Object.keys(contacts[contactType]).length < 1 ?
                                        <ListItem sx={{
                                            textAlign: "center",
                                        }}>
                                            <ListItemText secondary={`You have no added contacts`} />
                                        </ListItem>
                                        : Object.keys(contacts[contactType]).map((contact, index) => {
                                            return (
                                                <ListItem key={`added${index}`}>
                                                    <ListItemText primary={`${contacts.addedContacts[+contact]}`} />
                                                    <IconButton
                                                        onClick={(e) => {
                                                            handleAddedContactsOptions(e.currentTarget, +contact)
                                                        }}>
                                                        <MoreVert fontSize='small' />
                                                    </IconButton>
                                                </ListItem>
                                            )
                                        })}
                                </List>)
                        } else {
                            return (<List subheader={
                                <ListSubheader>
                                    Blocked contacts:
                                </ListSubheader>
                            } key={contactsTypeIndex}>
                                {Object.keys(contacts[contactType as "blockedContacts"]).length < 1 ?
                                    <ListItem sx={{
                                        textAlign: "center",
                                    }}>
                                        <ListItemText secondary={`No blocked contacts`} />
                                    </ListItem>
                                    : Object.keys(contacts[contactType as "blockedContacts"]).map((contact, index) => {
                                        return (
                                            <ListItem key={`blocked${index}`}>
                                                <ListItemText primary={`${contacts.blockedContacts[+contact]}`} />
                                                <IconButton
                                                    onClick={(e) => {
                                                        handleBlockedContactsOptions(e.currentTarget, +contact)
                                                    }}>
                                                    <MoreVert fontSize='small' />
                                                </IconButton>
                                            </ListItem>
                                        )
                                    })}
                            </List>)
                        }
                    })}
                </>
                :
                <List>
                    <ListItem sx={{
                        textAlign: "center",
                    }}>
                        <ListItemText secondary={`You have no saved contacts`} />
                    </ListItem>
                </List>
            }
        </>
    )
}

export default ContactsView