import React, { FormEvent, useState } from 'react'
import { Button, IconButton, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, TextField, } from '@mui/material'
import { MoreVert, Send, } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { addContact } from '../features/contactsFeatures/contactsStateSlice'


const ChatView: React.FC = () => {

    const dispatch = useDispatch()

    const { openChat } = useSelector((state: RootState) => state.chatsSlice)

    console.log(openChat)
    const [openMoreOptions, setOpenMoreOptions] = useState<null | HTMLElement>(null)
    const [messageBody, setMessageBody] = useState<string>('')
    const optionsOpen = Boolean(openMoreOptions)

    const handleOptions = (currentTarget: any) => {
        setOpenMoreOptions(currentTarget)
    }

    const handleAddContact = () => {
        dispatch(addContact({ newContact: openChat.username }))
        setOpenMoreOptions(null)
    }

    const handleBlock = () => {
        // dispatch(blockUser({username: openChat.username}))
    }

    const handleSend = (e: FormEvent) => {

    }




    return (
        <>
            {Object.keys(openChat).length > 0 ?
                <>
                    <List subheader={
                        <ListSubheader>
                            Your chat with {openChat.username}
                            <IconButton
                                onClick={(e) => {
                                    handleOptions(e.currentTarget)
                                }}
                                sx={{
                                    position: 'relative',
                                }}
                            >
                                <MoreVert fontSize='small' />
                            </IconButton>
                            <Menu
                                anchorEl={openMoreOptions}
                                open={optionsOpen}
                                onClose={() => setOpenMoreOptions(null)}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => handleAddContact()}>Add To Contacts</MenuItem>
                                <MenuItem onClick={() => handleBlock()}>Block</MenuItem>
                            </Menu>

                        </ListSubheader>
                    }>
                        {openChat.chat.map((message: { [key: string]: string }, index: number) => { // .chat[Object.keys(openChat.chat).at(0)]
                            console.log(message)
                            return (
                                <ListItem key={index} sx={{
                                    borderLeft: '1px solid #87b7e7'
                                }}>
                                    <ListItemText primary={`${Object.keys(message)[0]}: ${message[Object.keys(message)[0]]}`} secondary={`${message.time}`} />
                                    {/* <IconButton >
                            <Comment /> // could maybe implement a time icon
                        </IconButton> */}
                                </ListItem>
                            )
                        })}
                    </List>
                    <form
                        onSubmit={(e) => handleSend(e)}
                        style={{
                            display: "flex",
                            flexFlow: "column",
                            gap: "1rem",
                            width: "85%",
                            margin: "0 auto",
                        }}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Message"
                            variant="standard"
                            multiline
                            maxRows={20}
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            InputLabelProps={{ required: false }}
                            required
                        />
                        <Button
                            type='submit'
                            endIcon={<Send />}>Send</Button>
                    </form>
                </>
                :
                <List sx={{
                    width: "100%",
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <ListItem sx={{
                        textAlign: "center",
                    }}>
                        <ListItemText secondary={`You have no on-going chats`} />
                    </ListItem>
                </List>
            }
        </>
    )
}

export default ChatView