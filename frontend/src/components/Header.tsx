import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TemporaryDrawer from './TemporaryDrawer';
import ModalForm from './ModalForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'fixed',
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#EE8133',
      boxShadow: 'none',
    },
    toolbar: {
      padding: 0,
    },
    title: {
      flexGrow: 1,
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(5),
    },
    menuIcon: {
      fontSize: 40,
    },
  })
);

type Props = {
  getEntityData: Function;
  removeData: Function;
  resetEntityData: Function;
  removeSurfaceData: Function;
  getSurfaceData: Function;
};

const Header: React.VFC<Props> = ({
  getEntityData,
  removeData,
  resetEntityData,
  removeSurfaceData,
  getSurfaceData,
}) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [check, setCheck] = useState(['']);

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            〇〇市ダッシュボード
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon className={classes.menuIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TemporaryDrawer
        drawerOpen={drawerOpen}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        resetEntityData={resetEntityData}
        setCheck={setCheck}
      />
      <ModalForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        removeData={removeData}
        check={check}
        setCheck={setCheck}
        getEntityData={getEntityData}
        getSurfaceData={getSurfaceData}
        removeSurfaceData={removeSurfaceData}
      />
    </>
  );
};

export default Header;
