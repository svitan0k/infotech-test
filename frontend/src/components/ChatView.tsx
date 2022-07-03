import React, { FormEvent, useEffect, useState } from 'react'
import { Button, IconButton, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, TextField, } from '@mui/material'
import { MoreVert, Send, Visibility, VisibilityOff, } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { addContact } from '../features/contactsFeatures/contactsStateSlice'
import { decryptMessage, sendMessage } from '../features/chatFeatures/chatStateSlice'
import { decryptMorseCode } from '../contexts/SharedContext'
import LoadingButton from '@mui/lab/LoadingButton';



const ChatView: React.FC = () => {

    const dispatch = useDispatch<any>()

    const { openChat, decryptMessageStatus } = useSelector((state: RootState) => state.chatsSlice)
    const { userInfo } = useSelector((state: RootState) => state.userInfo)
    console.log(openChat)
    const [openMoreOptions, setOpenMoreOptions] = useState<null | HTMLElement>(null)
    const [messageBody, setMessageBody] = useState<string>('')
    const [decryptedMessages, setDecryptedMessages] = useState<{ [key: string]: string }>({})
    const [tempMessageStatus, setTempMessageStatus] = useState<string>(decryptMessageStatus)
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
        e.preventDefault()
        if (userInfo.user_id && userInfo.username) {
            dispatch(sendMessage({ sender: { id: userInfo.user_id.toString(), username: userInfo.username }, recipient: openChat.username, message: messageBody, isNewChat: false }))
        }
    }

    // function shouldDecrypt(message: string, messageIndex: string) {
    //     console.log('doing SHOULD DECRYPT')
    //     if (decryptedMessages.includes(messageIndex)) {
    //         console.log('removing from array')
    //         setDecryptedMessages(decryptedMessages.filter((message) => message !== messageIndex))
    //     } else {
    //         console.log('adding to array')
    //         setDecryptedMessages([...decryptedMessages, messageIndex])
    //     }
    // }

    function shouldDecrypt(message: string, messageIndex: string) {
        console.log('doing SHOULD DECRYPT', messageIndex)
        if (messageIndex in decryptedMessages) {
            console.log('removing from array of objects')
            setDecryptedMessages(Object.keys(decryptedMessages).filter((key) => key !== messageIndex).reduce((obj, key: string) => {
                console.log(key)
                obj[key] = decryptedMessages[key]
                return obj
            }, {} as { [key: string]: string }))
        } else {
            console.log('adding to array of objects')
            // redux logic starts here
            dispatch(decryptMessage({ message }))
            setDecryptedMessages({ ...decryptedMessages, [messageIndex]: 'pending' })
        }

    }

    useEffect(() => {
        setTempMessageStatus(decryptMessageStatus)
    }, [decryptMessageStatus])

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
                        {openChat.chat.map((message: { [key: string]: string }, index: string) => { // .chat[Object.keys(openChat.chat).at(0)]
                            console.log(typeof index, "index TYPE")
                            // console.log(message[Object.keys(message)[0]], decryptMorseCode(message[Object.keys(message)[0]]))
                            console.log(decryptedMessages)
                            return (
                                <ListItem key={index} sx={{
                                    borderLeft: '1px solid #87b7e7'
                                }}>
                                    <ListItemText primary={`${Object.keys(message)[0]}: ${index in decryptedMessages ? tempMessageStatus !== 'pending' ? 'pending' : tempMessageStatus : message[Object.keys(message)[0]]}`} secondary={`${message.time}`} />
                                    {userInfo.role === "newbie" ?
                                        index in decryptedMessages ?
                                            // ecrypt
                                            <LoadingButton loading={decryptMessageStatus === 'pending' ? true : false} variant="outlined" onClick={() => shouldDecrypt(message[Object.keys(message)[0]], index)}>
                                                <VisibilityOff />
                                            </LoadingButton>
                                            // <IconButton onClick={() => shouldDecrypt(message[Object.keys(message)[0]], index)}>
                                            // </IconButton>
                                            :
                                            // dencrypt
                                            <LoadingButton loading={decryptMessageStatus === 'pending' ? true : false} variant="outlined" onClick={() => shouldDecrypt(message[Object.keys(message)[0]], index)}>
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