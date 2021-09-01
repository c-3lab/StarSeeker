import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'fixed',
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#000080',
      boxShadow: 'none',
    },
    title: {
      flexGrow: 1,
      fontWeight: theme.typography.fontWeightBold,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    menuIcon: {
      fontSize: 40,
    },
  })
);

type Props = {
  drawerOpen: boolean;
  setDrawerOpen: Function;
};

const Header: React.VFC<Props> = ({ drawerOpen, setDrawerOpen }) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          〇〇市ダッシュボード
        </Typography>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <MenuIcon className={classes.menuIcon} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
