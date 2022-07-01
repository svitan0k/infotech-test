import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Circle, Close, HorizontalRule, Visibility, VisibilityOff } from '@mui/icons-material/';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { registerUser } from '../features/userInfoFeatures/userInfoStateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';



const RegisterPage: React.FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<any>()

    const { userInfo } = useSelector((state: RootState) => state.userInfo)

    const [username, setUsername] = useState<string>('')
    const [usernameError, setUsernameError] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [submitBtnTimeout, setSubmitBtnTimeout] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string>('')
    const [role, setRole] = useState<string>('')
    const renderCount = useRef<number>(0)

    useEffect(() => {
        if (userInfo.username) {
            navigate('/')
        }
    }, [userInfo.username, navigate])

    // username error check
    useEffect(() => {
        if (renderCount.current > 2) {
            if (username.length < 3) {
                setUsernameError('Username must be more than 3 characters long')
            } else if (username.match(/([^!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]*[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~])/)) {
                setUsernameError('Username must not contain any special characters')
            } else {
                setUsernameError('')
            }
        } else {
            renderCount.current += 1
        }
    }, [username])

    // password error check
    useEffect(() => {
        if (renderCount.current > 2) {
            if (password && !password.match(/([^!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]*[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~])/)) {
                setPasswordError('Password must contain at least one special character')
            } else {
                setPasswordError('')
            }
        } else {
            renderCount.current += 1
        }
    }, [password])


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        console.log(reason)
        setServerError('')
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        setSubmitBtnTimeout(true)

        dispatch(registerUser({ username: username, password: password, role: role }))
    }

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
                    }}>Register</Typography>
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
                            error={!!usernameError}
                            helperText={usernameError}
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
                            error={!!passwordError}
                            helperText={passwordError}
                            focused
                            required />

                        <FormControl variant="filled" required>
                            <InputLabel id="role-select" required={false}>Role</InputLabel>
                            <Select
                                disableUnderline
                                labelId="role-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <MenuItem value={'pro'}>Pro</MenuItem>
                                <MenuItem value={'newbie'}>Newbie</MenuItem>
                            </Select>
                        </FormControl>

                        <Button id="login-submit-button" type={!usernameError && !passwordError ? 'submit' : 'button'} variant="contained" disabled={submitBtnTimeout}>Register</Button>
                    </form>
                </Box>
                <Box>
                    <Typography sx={{
                        textAlign: "center",
                        paddingBottom: "3rem",
                    }}>Already have an account?&nbsp;
                        <Link to={'/login'} style={{
                            color: '#1565C0',
                            textDecoration: 'underline'
                        }}>
                            Login
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

export default RegisterPage