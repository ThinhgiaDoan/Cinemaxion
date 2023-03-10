import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  useScrollTrigger,
} from '@mui/material'
import { themeModes } from 'configs/theme.config'
import React, { cloneElement, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setThemeMode } from 'redux/features/themeModeSlice'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from './Logo'
import menuConfigs from 'configs/menu.config'
import { Link } from 'react-router-dom'
import { DarkModeOutlined, WbSunnyOutlined } from '@mui/icons-material'
import UserMenu from './UserMenu'
import { setAuthModalOpen } from 'redux/features/authModalSlice'
import Sidebar from './Sidebar'

const ScrollAppBar = ({ children, window }) => {
  const { themeMode } = useSelector(state => state.themeMode)

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
    target: window ? window() : undefined,
  })

  return cloneElement(children, {
    sx: {
      color: trigger
        ? 'text.primary'
        : themeMode === themeModes.dark
        ? 'primary.contrastText'
        : 'text.primary',
      backgroundColor: trigger
        ? 'background.paper'
        : themeMode === themeModes.dark
        ? 'transparent'
        : 'background.paper',
    },
  })
}
const Topbar = () => {
  const { user } = useSelector(state => state.user)
  const { appState } = useSelector(state => state.appState)
  const { themeMode } = useSelector(state => state.themeMode)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()

  const onSwitchTheme = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark
    dispatch(setThemeMode(theme))
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ScrollAppBar>
        <AppBar elevation={0} sx={{ zIndex: 9999 }}>
          <Toolbar
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction={'row'} spacing={1} alignItems='center'>
              <IconButton
                color='inherit'
                sx={{ mr: 2, display: { md: 'none' } }}
                onClick={toggleSidebar}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: { xs: 'inline-block', md: 'none' } }}>
                <Logo />
              </Box>
            </Stack>
            {/* main menu */}
            <Box
              flexGrow={1}
              alignItems='center'
              display={{ xs: 'none', md: 'flex' }}
            >
              <Box sx={{ marginRight: '30px' }}>
                <Logo />
              </Box>
              {menuConfigs.main.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    color: appState?.includes(item.state)
                      ? 'primary.contrastText'
                      : 'inherit',
                    mr: 2,
                  }}
                  component={Link}
                  to={item.path}
                  variant={
                    appState?.includes(item.state) ? 'contained' : 'text'
                  }
                >
                  {item.display}
                </Button>
              ))}
              <IconButton sx={{ color: 'inherit' }} onClick={onSwitchTheme}>
                {themeMode === themeModes.dark && <DarkModeOutlined />}
                {themeMode === themeModes.light && <WbSunnyOutlined />}
              </IconButton>
            </Box>

            {/* main menu */}
            <Stack spacing={3} direction='row' alignItems='center'>
              {!user && (
                <Button
                  variant='contained'
                  onClick={() => dispatch(setAuthModalOpen(true))}
                >
                  sign in
                </Button>
              )}
            </Stack>
            {/* user menu */}
            {user && <UserMenu />}
            {/* user menu */}
          </Toolbar>
        </AppBar>
      </ScrollAppBar>
    </>
  )
}

export default Topbar
