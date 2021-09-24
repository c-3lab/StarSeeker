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
  getPointsData: Function;
  removePointsData: Function;
  getSurfacesData: Function;
  removeSurfacesData: Function;
  resetData: Function;
};

const Header: React.VFC<Props> = ({
  getPointsData,
  removePointsData,
  getSurfacesData,
  removeSurfacesData,
  resetData,
}) => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [check, setCheck] = useState(['']);

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleReset = () => {
    setCheck([]);
    resetData();
  };

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
            onClick={handleDrawerOpen}
          >
            <MenuIcon className={classes.menuIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <TemporaryDrawer
        drawerOpen={drawerOpen}
        handleModalOpen={handleModalOpen}
        handleReset={handleReset}
      />
      <ModalForm
        modalOpen={modalOpen}
        handleModalOpen={handleModalOpen}
        check={check}
        setCheck={setCheck}
        getPointsData={getPointsData}
        removePointsData={removePointsData}
        getSurfacesData={getSurfacesData}
        removeSurfacesData={removeSurfacesData}
      />
    </>
  );
};

export default Header;
