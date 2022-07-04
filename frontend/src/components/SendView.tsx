import { Send } from '@mui/icons-material'
import { Button, InputAdornment, TextField } from '@mui/material'
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../features/chatFeatures/chatStateSlice'
import { RootState } from '../store'
import { shareContext } from '../contexts/SharedContext'
import { useNavigate } from 'react-router-dom'

interface SendViewTS {
    handleOptionChange: Function,
}

const SendView: React.FC<SendViewTS> = ({ handleOptionChange }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch<any>()

    const { passedUsername, setPassedUsername } = useContext(shareContext)

    const { userInfo } = useSelector((state: RootState) => state.userInfo)
    const { chats, openChat } = useSelector((state: RootState) => state.chatsSlice)

    const [recipient, setRecipient] = useState<string>(passedUsername ? passedUsername : '')
    const [messageBody, setMessageBody] = useState<string>('')

    const focusRef = useRef<HTMLInputElement | null>(null)

    const handleSend = async (e: FormEvent) => {
        e.preventDefault()
        handleOptionChange('chat')
        if (userInfo.user_id && userInfo.username) {
            if ((openChat.username && openChat.username === recipient.trim()) || chats[recipient.trim()]) {
                dispatch(sendMessage({ sender: { id: userInfo.user_id.toString(), username: userInfo.username }, recipient: recipient.trim(), message: messageBody, isNewChat: false }))
            } else {
                dispatch(sendMessage({ sender: { id: userInfo.user_id.toString(), username: userInfo.username }, recipient: recipient.trim(), message: messageBody, isNewChat: true }))
            }
        } else {
            navigate('/login')
        }
    }

    useEffect(() => {
        setPassedUsername('')
        focusRef.current?.focus()
    }, [passedUsername])

    return (
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
                variant="standard"
                label="To:"
                placeholder="username of the recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                InputLabelProps={{ required: false }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                }}
                inputRef={focusRef}
                required
                focused
            />
            <TextField
                id="outlined-multiline-flexible"
                label="Message:"
                placeholder="your message"
                variant="standard"
                multiline
                maxRows={20}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                InputLabelProps={{ required: false }}
                required
                focused
            />
            <Button
                type='submit'
                endIcon={<Send />}>Send</Button>
        </form>
    )
}

export default SendView