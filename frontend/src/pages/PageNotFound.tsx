import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <Box sx={{
		display: "flex",
		flexFlow: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		width: "100%",
	}}>
		<Typography variant={'h3'} sx={{
			color: "#1874d1",
		}}>404 - Page was not found</Typography>
		<Button><Link to={'/'}>Home</Link></Button>
    </Box>
  )
}

export default PageNotFound