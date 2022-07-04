import { Box, Button, InputAdornment, Snackbar, TextField, Typography } from '@mui/material'
import React, { FormEvent, useEffect, useState } from 'react'
import { Circle, Close, HorizontalRule, Visibility, VisibilityOff } from '@mui/icons-material/';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loginUser } from '../features/userInfoFeatures/userInfoStateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';




const LoginPage: React.FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<any>()

    const { userInfo, auxiliaryState } = useSelector((state: RootState) => state.userInfo)

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [submitBtnTimeout, setSubmitBtnTimeout] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string>('')


    useEffect(() => {
        if (userInfo.user_id) {
            navigate('/')
        }
    }, [userInfo.user_id, navigate])


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        setServerError('')
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        dispatch(loginUser({ username: username, password: password }))
    }

    useEffect(() => {
        setSubmitBtnTimeout(Boolean(auxiliaryState.submitButtonTimeout))
    }, [auxiliaryState.submitButtonTimeout])

    useEffect(() => {
        setServerError(auxiliaryState.serverError.toString())
    }, [auxiliaryState.serverError])

    const snakbarAction = (
        <>
            <Button onClick={handleCloseSnackbar}><Close fontSize='small' /></Button>
        </>
    )

    return (
        <Box sx={{
            width: { xs: "70%", sm: "50%", md: "35%" },
            maxWidth: "15rem",
            margin: "0 auto",
            height: "100%",
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box sx={{
                height: "100%",
                flex: "1",
                display: "flex",
                flexFlow: "column",
                gap: "5rem",
                paddingTop: "10rem",
            }}>
                {/* logo container */}
                <Box sx={{
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5rem",
                }}>
                    <Typography sx={{
                        fontWeight: "700",
                        fontSize: "2rem",
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <HorizontalRule sx={{
                            fontSize: '3rem',
                        }} /><Circle fontSize='large' /><HorizontalRule sx={{
                            fontSize: '3rem',
                        }} />
                    </Typography>
                    <Typography sx={{
                        fontWeight: "300",
                        fontSize: "2rem"
                    }}>Login</Typography>
                </Box>


                {/* form container */}
                <Box>
                    <form style={{
                        display: "flex",
                        flexFlow: "column",
                        gap: "2rem",
                        margin: "0 auto",
                        width: "100%",
                    }}
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <TextField label="Username" variant="filled"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{ disableUnderline: true, }}
                            InputLabelProps={{ required: false }}
                            focused
                            required />
                        <TextField label="Password" variant="filled"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                type: showPassword ? "text" : "password",
                                endAdornment: (
                                    <InputAdornment position='start' sx={{
                                        cursor: "pointer",
                                    }}>
                                        {showPassword ?
                                            <VisibilityOff
                                                onClick={() => handleClickShowPassword()}
                                                onMouseDown={(e) => handleMouseDownPassword(e)} />
                                            :
                                            <Visibility
                                                onClick={() => handleClickShowPassword()}
                                                onMouseDown={(e) => handleMouseDownPassword(e)} />}
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{ required: false }}
                            focused
                            required />

                        <Button id="login-submit-button" variant="contained" type="submit" disabled={submitBtnTimeout}>Login</Button>
                    </form>
                </Box>
                <Box>
                    <Typography sx={{
                        textAlign: "center",
                        paddingBottom: "3rem",
                    }}>Don't have an account?&nbsp;
                        <Link to={'/register'} style={{
                            color: '#1565C0',
                            textDecoration: 'underline'
                        }}>
                            Register
                        </Link>
                    </Typography>
                </Box>
                <Snackbar
                    open={!!serverError}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    message={serverError}
                    action={snakbarAction}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                />
            </Box>
        </Box>
    )
}

export default LoginPage