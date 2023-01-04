import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import DrawerWrapper from './DrawerWrapper';
import DatasetDialog from './DatasetDialog';

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
  fetchPointData: Function;
  clearAllPointData: Function;
  fetchSurfaceData: Function;
  clearAllSurfaceData: Function;
  resetData: Function;
};

const Header: React.VFC<Props> = ({
  fetchPointData,
  clearAllPointData,
  fetchSurfaceData,
  clearAllSurfaceData,
  resetData,
  fiware
}) => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpenDatasetDialog, setIsOpenDatasetDialog] = useState(false);
  const [check, setCheck] = useState([]);

  const toggleDrawerOpen = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleOpenDatasetDialog = () => {
    setIsOpenDatasetDialog(!isOpenDatasetDialog);
  };

  const handleReset = () => {
    setCheck([]);
    resetData();
  };

  const title = 'ダッシュボード';

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawerOpen}
          >
            <MenuIcon className={classes.menuIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DrawerWrapper
        isDrawerOpen={isDrawerOpen}
        handleModalOpen={toggleOpenDatasetDialog}
        handleReset={handleReset}
        check={check}
        setCheck={setCheck}
        fetchPointData={fetchPointData}
        clearAllPointData={clearAllPointData}
        fetchSurfaceData={fetchSurfaceData}
        clearAllSurfaceData={clearAllSurfaceData}
	fiware={fiware}
      />
      <DatasetDialog
        isOpenDatasetDialog={isOpenDatasetDialog}
        closeDialog={() => setIsOpenDatasetDialog(false)}
        check={check}
        setCheck={setCheck}
        fetchPointData={fetchPointData}
        clearAllPointData={clearAllPointData}
        fetchSurfaceData={fetchSurfaceData}
        clearAllSurfaceData={clearAllSurfaceData}
	fiware={fiware}
      />
    </>
  );
};

export default Header;
