import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import StorageIcon from '@material-ui/icons/Storage';
import LaunchIcon from '@material-ui/icons/Launch';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { GeoJsonObject } from 'geojson';

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolBar: theme.mixins.toolbar,
  })
);

type Props = {
  drawerOpen: boolean;
  modalOpen: boolean;
  setModalOpen: Function;
  entityData: GeoJsonObject[];
  setEntityData: Function;
  setCheck: Function;
};

const TemporaryDrawer: React.VFC<Props> = ({
  drawerOpen,
  modalOpen,
  setModalOpen,
  entityData,
  setEntityData,
  setCheck,
}) => {
  const classes = useStyles();

  const handleResetClick = () => {
      setCheck([]);
      setEntityData([]);
      setCheck([]);
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      variant="persistent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolBar} />
      <List component="nav" disablePadding>
        <ListItem
          button
          key={'オープンデータ'}
          onClick={() => setModalOpen(!modalOpen)}
        >
          <StorageIcon />
          <ListItemText primary={'オープンデータ'} />
          <LaunchIcon />
        </ListItem>
        <Divider />
        <ListItem button key={'リセット'}>
          <RotateLeftIcon />
          <ListItemText
            primary={'リセット'}
            onClick={() => handleResetClick()}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default TemporaryDrawer;
