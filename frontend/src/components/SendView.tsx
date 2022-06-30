import { TextField } from '@mui/material'
import React, { useState } from 'react'



const SendView: React.FC = () => {

    const [messageBody, setMessageBody] = useState<string>('')

    return (
        <form style={{
            display: "flex",
            flexFlow: "column",
            gap: "1rem",
            width: "85%",
            margin: "0 auto",
        }}>
            <TextField
                variant="standard"
                label="To: username"
                placeholder="username of the recipient" />
            <TextField
                id="outlined-multiline-flexible"
                label="Message"
                variant="standard"
                multiline
                maxRows={20}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
            />
        </form>
    )
}

export default SendView