import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, ButtonGroup, useMediaQuery, } from '@mui/material'
import SendView from '../components/SendView'
import InboxView from '../components/InboxView'
import ChatView from '../components/ChatView'
import ContactsView from '../components/ContactsView'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { userLogout } from '../features/userInfoFeatures/userInfoStateSlice'



const Homepage: React.FC = () => {
	const screenWidth = useMediaQuery('(max-width: 600px)')

	const navigate = useNavigate()
	const dispatch = useDispatch<any>()

	const { userInfo } = useSelector((state: RootState) => state.userInfo)

	const [currentView, setCurrentView] = useState<string>('inbox')

	useEffect(() => {
		if (!userInfo.username) {
			navigate('/login')
		}
	}, [userInfo.username, navigate])

	const handleLogout = () => {
		dispatch(userLogout())
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
			<Button
				sx={{
					position: "absolute",
					top: "1rem",
					right: "1rem",
				}}
				onClick={() => handleLogout()}
			>Log out</Button>
			<ButtonGroup
				size = {screenWidth ? "small" : "large"}
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
			</ButtonGroup>
			<Box sx={{
				width: "100%",
			}}>
				{currentView === 'inbox' ? <InboxView handleOptionChange={handleOptionChange}/>
					: currentView === 'send' ? <SendView handleOptionChange={handleOptionChange}/>
					: currentView === 'chat' ? <ChatView />
					: <ContactsView handleOptionChange={handleOptionChange} />
				}
			</Box>
		</Box >
	)
}

export default Homepage