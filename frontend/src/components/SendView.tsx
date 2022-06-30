import { Send } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import React, { FormEvent, useState } from 'react'



const SendView: React.FC = () => {

    const [recipient, setRecipient] = useState<string>('')
    const [messageBody, setMessageBody] = useState<string>('')

    const handleSend = async (e: FormEvent) => {
        e.preventDefault()
        
        // save message to redux(regardless of whether or not the user exists)
        // Keys are usernames, and they store objects -- chat messages
        // 
        
        let currentChats = sessionStorage.getItem('chat')
        if (currentChats) {
            sessionStorage.setItem('chats', JSON.stringify([...currentChats, recipient]))
        } else {
            sessionStorage.setItem('chats', JSON.stringify([recipient]))
        }
    }

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
                label="To: username"
                placeholder="username of the recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required/>
            <TextField
                id="outlined-multiline-flexible"
                label="Message"
                variant="standard"
                multiline
                maxRows={20}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                required
            />
            <Button
            type='submit'
            endIcon={<Send/>}>Send</Button>
        </form>
    )
}

export default SendView