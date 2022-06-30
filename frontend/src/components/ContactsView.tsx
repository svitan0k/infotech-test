import React, { useState } from 'react'
import { IconButton, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, } from '@mui/material'
import { Comment, MoreVert, } from '@mui/icons-material'


const ContactsView: React.FC = () => {

    const [openMoreOptions, setOpenMoreOptions] = useState<null | HTMLElement>(null)
    const optionsOpen = Boolean(openMoreOptions)

    return (
        <List subheader={
            <ListSubheader>
                Your contacts:
            </ListSubheader>
        }>
            {/* forEach unique sender message in session storage */}
            <Menu
                anchorEl={openMoreOptions}
                open={optionsOpen}
                onClose={() => setOpenMoreOptions(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => setOpenMoreOptions(null)}>Remove from contacts</MenuItem>
                <MenuItem onClick={() => setOpenMoreOptions(null)}>Block</MenuItem>
            </Menu>

            <ListItem>
                <ListItemText primary="sender username" secondary="message stored in session storage" />
                <IconButton
                    onClick={(e) => {
                        setOpenMoreOptions(e.currentTarget)
                    }}>
                    <MoreVert fontSize='small' />
                </IconButton>
            </ListItem>

            <ListItem>
                <ListItemText primary="sender username" secondary="message stored in session storage" />
                <IconButton
                    onClick={(e) => {
                        setOpenMoreOptions(e.currentTarget)
                    }}>
                    <MoreVert fontSize='small' />
                </IconButton>
            </ListItem>

            <ListItem>
                <ListItemText primary="sender username" secondary="message stored in session storage" />
                <IconButton
                    onClick={(e) => {
                        setOpenMoreOptions(e.currentTarget)
                    }}>
                    <MoreVert fontSize='small' />
                </IconButton>
            </ListItem>
        </List>
    )
}

export default ContactsView