import { Send } from '@mui/icons-material'
import { Button, InputAdornment, TextField } from '@mui/material'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
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

    const [recipient, setRecipient] = useState<string>(passedUsername ? passedUsername : '')
    const [messageBody, setMessageBody] = useState<string>('')

    const handleSend = async (e: FormEvent) => {
        e.preventDefault()
        handleOptionChange('chat')
        if (userInfo.user_id) {
            console.log('sending new message as ', userInfo.user_id)
            dispatch(sendMessage({ sender: userInfo.user_id.toString(), recipient: recipient, message: messageBody })) // replace sender with id? (yeah... yeah.)
        } else {
            navigate('/login')
        }
    }

    useEffect(() => {
        setPassedUsername('')
    }, [])

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