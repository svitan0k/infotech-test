import React, { useContext, useEffect, useState } from 'react'
import { IconButton, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, } from '@mui/material'
import { MoreVert, } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { blockContact, removeContact, } from '../features/contactsFeatures/contactsStateSlice'
import { shareContext } from '../contexts/SharedContext'



interface ContactsViewTS {
    handleOptionChange: Function,
}


const ContactsView: React.FC<ContactsViewTS> = ({ handleOptionChange }) => {

    const dispatch = useDispatch<any>()
    const { contacts } = useSelector((state: RootState) => state.contactsSlice)
    const { passedUsername, setPassedUsername } = useContext(shareContext)

    const [openMoreOptions, setOpenMoreOptions] = useState<HTMLElement | null>(null)
    const [optionsOnId, setOptionsOnId] = useState<number | null>(null)
    const optionsOpen = Boolean(openMoreOptions)


    const handleOptions = (currentTarget: any, contactId: number) => {
        setOpenMoreOptions(currentTarget)
        setOptionsOnId(contactId)
    }

    const handleRemoveContact = () => {
        dispatch(removeContact({ optionsOnId }))
        setOpenMoreOptions(null)
    }

    const handleBlockUser = () => {
        dispatch(blockContact({ username: contacts[optionsOnId!] }))
        setOpenMoreOptions(null)
    }



    const handleSendNewMessage = async () => {
        setPassedUsername(contacts[optionsOnId!])
    }


    useEffect(() => {
        if (passedUsername) {
            console.log(passedUsername)
            handleOptionChange('send')
        }
    }, [passedUsername, handleOptionChange])


    return (
        <List subheader={
            <ListSubheader>
                Your contacts:
            </ListSubheader>
        }>
            {Object.keys(contacts).length > 0 ?
                <>
                    <Menu
                        anchorEl={openMoreOptions}
                        open={optionsOpen}
                        onClose={() => setOpenMoreOptions(null)}
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
                    {Object.keys(contacts).map((contact, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemText primary={`${contacts[+contact]}`} />
                                <IconButton
                                    onClick={(e) => {
                                        handleOptions(e.currentTarget, +contact)
                                    }}>
                                    <MoreVert fontSize='small' />
                                </IconButton>
                            </ListItem>
                        )
                    })}
                </>
                :
                <ListItem sx={{
                    textAlign: "center",
                }}>
                    <ListItemText secondary={`You have no saved contacts`} />
                </ListItem>
            }
        </List >
    )
}

export default ContactsView