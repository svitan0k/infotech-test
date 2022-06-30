import React from 'react'
import { IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, } from '@mui/material'
import { Comment, } from '@mui/icons-material'


const InboxView: React.FC = () => {
    return (
        <List subheader={
            <ListSubheader>
                Your current chats:
            </ListSubheader>
        }>
            {/* forEach unique sender message in session storage */}
            <ListItem>
                <ListItemButton>
                    <ListItemText primary="sender username" secondary="message stored in session storage" />
                </ListItemButton>
                <IconButton >
                    <Comment />
                </IconButton>
            </ListItem>

            <ListItem>
                <ListItemButton>
                    <ListItemText primary="sender username" secondary="message stored in session storage" />
                </ListItemButton>
                <IconButton >
                    <Comment />
                </IconButton>
            </ListItem>

            <ListItem>
                <ListItemButton>
                    <ListItemText primary="sender username" secondary="message stored in session storage" />
                </ListItemButton>
                <IconButton >
                    <Comment />
                </IconButton>
            </ListItem>
        </List>
    )
}

export default InboxView