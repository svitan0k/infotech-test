import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, ButtonGroup, styled, } from '@mui/material'
import SendView from '../components/SendView'
import InboxView from '../components/InboxView'
import ChatView from '../components/ChatView'
import ContactsView from '../components/ContactsView'

const Homepage: React.FC = () => {

	const navigate = useNavigate()

	const [currentView, setCurrentView] = useState<string>('inbox')
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!sessionStorage.getItem('username'))

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login')
		}
	}, [isLoggedIn, navigate])

	const handleLogout = () => {
		sessionStorage.removeItem('username')
		sessionStorage.removeItem('token')
		setIsLoggedIn(false)
	}

	const handleOptionChange = (elemId: string) => {
		setCurrentView(elemId)

		let allButtons = document.querySelectorAll('#button-group-list > *') as NodeListOf<HTMLElement>

		allButtons.forEach((elem) => {
			if (elem.id === elemId) {
				elem.style.backgroundColor = "#87b7e722"
			} else {
				elem.style.backgroundColor = "transparent"
			}
		})
	}

	const styledButtonGroup = styled(ButtonGroup)(({theme}) => ({
		[theme.breakpoints.down('md')]: {
			size: "small"
		},

		[theme.breakpoints.up('md')]: {
			size: "large"
		}
	}))

	return (
		<Box sx={{
			maxWidth: "35rem",
			margin: "0 auto",
			marginTop: "7rem",
			display: "flex",
			flexFlow: "column",
			justifyContent: "center",
			alignItems: "center",
		}}>
			<Button
				sx={{
					position: "absolute",
					top: "1rem",
					right: "1rem",
				}}
				onClick={() => handleLogout()}
			>Log out</Button>
			<styledButtonGroup
				id="button-group-list"
				variant="outlined"
				aria-label="text button group"
				sx={{
					borderRadius: "0",
					margin: "3rem 0",
				}}>
				<Button
					id="inbox"
					onClick={() => handleOptionChange('inbox')}>Inbox</Button>
				<Button
					id="send"
					onClick={() => handleOptionChange('send')}>Send</Button>
				<Button
					id="chat"
					onClick={() => handleOptionChange('chat')}>Chat</Button>
				<Button
					id="contacts"
					onClick={() => handleOptionChange('contacts')}>Contacts</Button>
			</styledButtonGroup>
			<Box sx={{
				width: "100%",
			}}>
				{currentView === 'inbox' ? <InboxView />
					: currentView === 'send' ? <SendView />
					: currentView === 'chat' ? <ChatView />
					: <ContactsView />
				}
			</Box>
		</Box >
	)
}

export default Homepage