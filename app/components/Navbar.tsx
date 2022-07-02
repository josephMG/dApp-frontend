import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {
  Brightness4Outlined as ToggleDarkModeIcon,
  Brightness5Outlined as ToggleLightModeIcon,
} from '@mui/icons-material';
import { makeStyles, useTheme } from '@mui/styles';
import useThemeMode from 'hooks/useThemeMode';
import { Theme } from '@mui/material';
import { CustomTheme } from 'lib/theme';
/*
import dynamic from "next/dynamic";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});
<ConnectWallet />
*/
const Navbar = () => {
  const classes = useStyles();
  const theme = useTheme<CustomTheme>();
  const { darkMode, toggleMode } = useThemeMode();

  return (
    <AppBar position="static" className={classes.root} color="transparent">
      <Toolbar>
        <img src="/logo.svg" alt="logo" className={classes.img} />

        <Typography variant="h6" className={classes.title}>
          Next.js Web3 starter
        </Typography>

        <IconButton edge="start" color="inherit" aria-label="mode" onClick={toggleMode} className={classes.toggleBtn}>
          {darkMode ? (
            <ToggleLightModeIcon htmlColor={theme.custom.palette.iconColor} />
          ) : (
            <ToggleDarkModeIcon htmlColor={theme.custom.palette.iconColor} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    margin: 'auto',
    maxWidth: 1100,
    boxShadow: 'none',
  },
  img: {
    width: 50,
    marginRight: 20,
  },
  title: {
    flexGrow: 1,
    // color: '#784ffe',
    [theme.breakpoints.down('xs')]: {
      fontSize: 0,
      // display: 'none'
    },
  },
  toggleBtn: {
    marginRight: 20,
    [theme.breakpoints.down('xs')]: {
      marginRight: 5,
    },
  },
}));

export default Navbar;
