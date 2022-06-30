import React, { useState } from 'react'
import { IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, Menu, MenuItem, } from '@mui/material'
import { Comment, MoreVert, } from '@mui/icons-material'


const ChatView: React.FC = () => {

    const [openMoreOptions, setOpenMoreOptions] = useState<null | HTMLElement>(null)
    const optionsOpen = Boolean(openMoreOptions)

    return (
        <List subheader={
            <ListSubheader>
                Your chat with {'<'}username{'>'}
                <IconButton
                    onClick={(e) => {
                        setOpenMoreOptions(e.currentTarget)
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
                    <MenuItem onClick={() => setOpenMoreOptions(null)}>Add To Contacts</MenuItem>
                    <MenuItem onClick={() => setOpenMoreOptions(null)}>Block</MenuItem>
                </Menu>

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

export default ChatView