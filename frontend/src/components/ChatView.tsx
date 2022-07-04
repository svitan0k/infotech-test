import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, IconButton, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, TextField, } from '@mui/material'
import { MoreVert, Send, Visibility, VisibilityOff, } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { addContact, blockContact, removeContact } from '../features/contactsFeatures/contactsStateSlice'
import { decryptMessage, sendMessage } from '../features/chatFeatures/chatStateSlice'
import LoadingButton from '@mui/lab/LoadingButton';



const ChatView: React.FC = () => {

    const dispatch = useDispatch<any>()

    const { contacts } = useSelector((state: RootState) => state.contactsSlice)
    const { openChat, decryptMessageStatus, decryptMessageText, blockedStatus } = useSelector((state: RootState) => state.chatsSlice)
    const { userInfo } = useSelector((state: RootState) => state.userInfo)

    const [openMoreOptions, setOpenMoreOptions] = useState<null | HTMLElement>(null)
    const [messageBody, setMessageBody] = useState<string>('')
    const [decryptedMessages, setDecryptedMessages] = useState<{ [key: string]: string }>({})
    const [tempMessageText, setTempMessageText] = useState<{ [key: string]: string }>({})
    const optionsOpen = Boolean(openMoreOptions)
    const inputFocus = useRef<HTMLInputElement | null>(null)


    const handleOptions = (currentTarget: any) => {
        setOpenMoreOptions(currentTarget)
    }

    const handleAddContact = () => {
        if (userInfo.username) {
            dispatch(addContact({ owner: userInfo.username, contact: openChat.username }))
        }
        setOpenMoreOptions(null)
    }

    const handleRemoveContact = () => {
        if (userInfo.username) {
            dispatch(removeContact({ owner: userInfo.username, contact: openChat.username }))
        }
        setOpenMoreOptions(null)
    }

    const handleBlock = () => {
        if (userInfo.username) {
            dispatch(blockContact({ owner: userInfo.username, contact: openChat.username }))
            setOpenMoreOptions(null)
        }
    }

    const handleSend = (e: FormEvent) => {
        e.preventDefault()
        if (userInfo.user_id && userInfo.username) {
            dispatch(sendMessage({ sender: { id: userInfo.user_id.toString(), username: userInfo.username }, recipient: openChat.username, message: messageBody, isNewChat: false }))
        }
        setMessageBody('')
        inputFocus.current?.focus()
    }

    function shouldDecrypt(message: string, messageIndex: string) {
        if (messageIndex in decryptedMessages) {
            setDecryptedMessages(Object.keys(decryptedMessages).filter((key) => key !== messageIndex).reduce((obj, key: string) => {
                obj[key] = decryptedMessages[key]
                return obj
            }, {} as { [key: string]: string }))
        } else {
            // redux logic starts here
            dispatch(decryptMessage({ message, messageIndex }))
            setDecryptedMessages({ ...decryptedMessages, [messageIndex]: 'pending' })
        }

    }

    useEffect(() => {
        setTempMessageText({ ...decryptMessageText })
    }, [decryptMessageText])


    useEffect(() => {
        const chatBodyElem = document.getElementById('chat-body') as HTMLUListElement
        if (chatBodyElem) {
            chatBodyElem.scrollTop = chatBodyElem.scrollHeight
        }
    }, [openChat])

    return (
        <>
            {Object.keys(openChat).length > 0 ?
                <>
                    {blockedStatus ?
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
                                <ListItemText secondary={`${blockedStatus}`} secondaryTypographyProps={{
                                    fontSize: "1rem",
                                    color: "#87b7e7",
                                }} />
                            </ListItem>
                        </List> :
                        <>
                            <List sx={{
                                overflow: "auto",
                                maxHeight: "50vh",
                                marginBottom: "30px",
                            }}
                                id={'chat-body'}
                                subheader={
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
                                            <MenuItem onClick={
                                                contacts.addedContacts.includes(openChat.username) ?
                                                    () => handleRemoveContact()
                                                    : () => handleAddContact()}>
                                                {contacts.addedContacts.includes(openChat.username) ?
                                                    "Remove from contacts"
                                                    : "Add to contacts"}
                                            </MenuItem>
                                            <MenuItem onClick={() => handleBlock()}>Block</MenuItem>
                                        </Menu>

                                    </ListSubheader>
                                }>
                                {openChat.chat.map((message: { [key: string]: string }, index: string) => { // .chat[Object.keys(openChat.chat).at(0)]
                                    return (
                                        <ListItem key={index} sx={{
                                            borderLeft: '1px solid #87b7e7'
                                        }}>
                                            <ListItemText primary={`${Object.keys(message)[0]}: ${index in decryptedMessages && tempMessageText[index] ? tempMessageText[index] : message[Object.keys(message)[0]]}`} secondary={`${message.time}`} />
                                            {userInfo.role === "newbie" ?
                                                index in decryptedMessages ?
                                                    // ecrypt
                                                    <LoadingButton loading={decryptMessageStatus[index] === 'pending' ? true : false} variant="outlined" onClick={() => shouldDecrypt(message[Object.keys(message)[0]], index.toString())}>
                                                        <VisibilityOff />
                                                    </LoadingButton>
                                                    // <IconButton onClick={() => shouldDecrypt(message[Object.keys(message)[0]], index)}>
                                                    // </IconButton>
                                                    :
                                                    // dencrypt
                                                    <LoadingButton loading={decryptMessageStatus[index] === 'pending' ? true : false} variant="outlined" onClick={() => shouldDecrypt(message[Object.keys(message)[0]], index.toString())}>
                                                        <Visibility />
                                                    </LoadingButton>
                                                // <IconButton onClick={() => shouldDecrypt(message[Object.keys(message)[0]], index)}>
                                                // </IconButton>
                                                : null}
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
                                    inputRef={inputFocus}
                                    required
                                />
                                <Button
                                    type='submit'
                                    endIcon={<Send />}>Send</Button>
                            </form>
                        </>}
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