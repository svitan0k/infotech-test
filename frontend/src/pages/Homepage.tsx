import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, ButtonGroup, Divider, Typography, useMediaQuery, } from '@mui/material'
import SendView from '../components/SendView'
import InboxView from '../components/InboxView'
import ChatView from '../components/ChatView'
import ContactsView from '../components/ContactsView'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { connectToWebSocket, userLogout } from '../features/userInfoFeatures/userInfoStateSlice'
import { AccountCircle, Logout, NotificationsActive } from '@mui/icons-material'
import { clearChatState } from '../features/chatFeatures/chatStateSlice'
import { clearContactsState } from '../features/contactsFeatures/contactsStateSlice'
import socket from '../webSocketsUtil/webSocketServer'



const Homepage: React.FC = () => {
	const screenWidth = useMediaQuery('(max-width: 600px)')

	const navigate = useNavigate()
	const dispatch = useDispatch<any>()

	const { userInfo } = useSelector((state: RootState) => state.userInfo)
	const { inboxStatus, openChat, blockedStatus } = useSelector((state: RootState) => state.chatsSlice)

	const [currentView, setCurrentView] = useState<string>('inbox')

	useEffect(() => {
		if (!userInfo.user_id) {
			navigate('/login')
		}
	}, [userInfo.user_id, navigate])

	useEffect(() => {
		if (userInfo.user_id) {
			dispatch(connectToWebSocket())
		}
	}, [])

	const handleLogout = () => {
		dispatch(userLogout())
		socket.disconnect()
		socket.off('message')
		dispatch(clearChatState(''))
		dispatch(clearContactsState())
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
			<Box sx={{
				position: "absolute",
				top: "1rem",
				right: "1rem",
				display: "flex",
				flexFlow: "row",
				alignItems: "center",
				justifyContent: "center",
			}}>
				<Typography sx={{
					display: "flex",
					flexFlow: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: "0.5rem",
				}}>
					<AccountCircle />
					{userInfo.username}
				</Typography>
				<Divider orientation="vertical" flexItem sx={{
					margin: "0 1rem",
				}} />
				<Button onClick={() => handleLogout()}
				>
					<Logout />
					Log out
				</Button>
			</Box>
			<ButtonGroup
				size={screenWidth ? "small" : "large"}
				id="button-group-list"
				variant="outlined"
				aria-label="text button group"
				sx={{
					borderRadius: "0",
					margin: "3rem 0",
				}}>
				<Button
					startIcon={Object.keys(inboxStatus).length > 0 && <NotificationsActive />}
					id="inbox"
					onClick={() => handleOptionChange('inbox')}
					sx={currentView === 'inbox' ? { backgroundColor: "#87b7e722" } : {}}
				>Inbox</Button>
				<Button
					id="send"
					onClick={() => handleOptionChange('send')}>Send</Button>
				<Button
					disabled={blockedStatus || !openChat.username ? true : false}
					id="chat"
					onClick={() => handleOptionChange('chat')}>Chat</Button>
				<Button
					id="contacts"
					onClick={() => handleOptionChange('contacts')}>Contacts</Button>
			</ButtonGroup>
			<Box sx={{
				width: "100%",
			}}>
				{currentView === 'inbox' ? <InboxView handleOptionChange={handleOptionChange} />
					: currentView === 'send' ? <SendView handleOptionChange={handleOptionChange} />
						: currentView === 'chat' ? <ChatView />
							: <ContactsView handleOptionChange={handleOptionChange} />
				}
			</Box>
		</Box >
	)
}

export default Homepage