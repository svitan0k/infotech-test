import React from 'react'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, } from '@mui/material'
import { Comment, NotificationsActive, } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { openChat } from '../features/chatFeatures/chatStateSlice'


interface InboxViewTS {
    handleOptionChange: Function,
}

const InboxView: React.FC<InboxViewTS> = ({ handleOptionChange }) => {

    const dispatch = useDispatch()

    const { chats, inboxStatus } = useSelector((state: RootState) => state.chatsSlice)

    const handleOpenChat = (chatObj: object, username: string) => {
        console.log(chatObj)
        handleOptionChange('chat')
        dispatch(openChat({ chat: chatObj, username: username, }))
    }

    return (
        <List subheader={
            <ListSubheader>
                Your current chats:
            </ListSubheader>
        }>

            {Object.keys(chats).length > 0
                ? Object.keys(chats).map((chat, index: number) => {
                    return (
                        <ListItem key={index}>
                            <ListItemButton onClick={() => handleOpenChat(chats[chat], chat)}>
                                {/* Sometimes my genius... it's almost frightening */}
                                {inboxStatus[chat] ?
                                    <>
                                        <ListItemText primary={`${chat}`} secondary={`${chats[chat].at(-1)[Object.keys(chats[chat].at(-1))[0]]}`} />
                                        <ListItemIcon>
                                            <NotificationsActive />
                                        </ListItemIcon>
                                    </>
                                    :
                                    <ListItemText primary={`${chat}`} secondary={`${chats[chat].at(-1)[Object.keys(chats[chat].at(-1))[0]]}`} />}
                            </ListItemButton>
                            <IconButton onClick={() => handleOpenChat(chats[chat], chat)}>
                                <Comment />
                            </IconButton>
                        </ListItem>
                    )
                })
                :
                <ListItem sx={{
                    textAlign: "center",
                }}>
                    <ListItemText secondary={`You have no new messages`} />
                </ListItem>
            }
        </List>
    )
}

export default InboxView