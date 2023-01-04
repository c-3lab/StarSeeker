import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles, createStyles, Theme } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import StorageIcon from '@material-ui/icons/Storage';
import LaunchIcon from '@material-ui/icons/Launch';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import axios from 'axios';

const drawerWidth = 240;

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
    treeView: {
      maxWidth: drawerWidth,
      flexGrow: 1,
    },
  })
);

const ColorCheckbox = (props) => {
  const customTheme = (theme) => ({
    root: {
      color: props.datasetColor,
      '&$checked': {
        color: props.datasetColor,
      },
    },
    checked: {},
  });
  const ComponentName = withStyles(customTheme)(Checkbox);
  return <ComponentName {...props} />;
};

type Props = {
  isDrawerOpen: boolean;
  handleModalOpen: React.MouseEventHandler<HTMLDivElement>;
  handleReset: React.MouseEventHandler<HTMLDivElement>;
  check: string[];
  setCheck: Function;
  fetchPointData: Function;
  clearAllPointData: Function;
  fetchSurfaceData: Function;
  clearAllSurfaceData: Function;
  fiware: {
    tenant: string;
    servicePath: string;
  }
};

const DrawerWrapper: React.VFC<Props> = ({
  isDrawerOpen,
  handleModalOpen,
  handleReset,
  check,
  setCheck,
  fetchPointData,
  clearAllPointData,
  fetchSurfaceData,
  clearAllSurfaceData,
  fiware
}) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const tenant = fiware.tenant;
      const servicePath = fiware.servicePath;
      const headers = {
        'tenant': tenant,
        'servicepath': servicePath
      };
      if(!tenant) {
        delete headers['tenant'];
      }
      if(!servicePath) {
        delete headers['servicepath'];
      }
      const res = await axios.get('/api/categories/categories', { headers: headers });
      setCategories(res.data);
    }
    fetchCategories();
  }, []);

  const handleChangePointChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: number,
    entityType: string,
    iconColor: string
  ) => {
    if (check.includes(entityType)) {
      setCheck(check.filter((data) => data != entityType));
      clearAllPointData(datasetId);
    } else {
      setCheck([...check, entityType]);
      fetchPointData(datasetId, iconColor);
    }
  };

  const handleChangeSurfaceChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: number,
    entityType: string,
    borderColor: string,
    fillColor: string
  ) => {
    if (check.includes(entityType)) {
      setCheck(check.filter((data) => data != entityType));
      clearAllSurfaceData(datasetId);
    } else {
      setCheck([...check, entityType]);
      fetchSurfaceData(datasetId, borderColor, fillColor);
    }
  };

  if (process.env.NEXT_PUBLIC_DATASET_LIST_BY == 'menu') {
    return (
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        variant="persistent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolBar} />
        <TreeView
          className={classes.treeView}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {categories.map((data) => {
            return (
              <>
                <TreeItem nodeId={data.name} label={data.name}>
                  {data.pointDatasets.map((dataset) => (
                    <TreeItem
                      key={dataset.entityId}
                      nodeId={dataset.entityType}
                      label={
                        <FormControlLabel
                          control={
                            <ColorCheckbox
                              datasetColor={dataset.color}
                              name={dataset.entityType}
                              checked={check.includes(dataset.entityType)}
                              onChange={(e) =>
                                handleChangePointChecked(
                                  e,
                                  dataset.id,
                                  dataset.entityType,
                                  dataset.color
                                )
                              }
                            />
                          }
                          label={dataset.name}
                        />
                      }
                    />
                  ))}
                  {data.surfaceDatasets.map((dataset) => (
                    <TreeItem
                      key={dataset.entityId}
                      nodeId={dataset.entityType}
                      label={
                        <FormControlLabel
                          control={
                            <ColorCheckbox
                              datasetColor={dataset.fillColor}
                              name={dataset.entityType}
                              checked={check.includes(dataset.entityType)}
                              onChange={(e) =>
                                handleChangeSurfaceChecked(
                                  e,
                                  dataset.id,
                                  dataset.entityType,
                                  dataset.borderColor,
                                  dataset.fillColor
                                )
                              }
                            />
                          }
                          label={dataset.name}
                        />
                      }
                    />
                  ))}
                </TreeItem>
              </>
            );
          })}
        </TreeView>
        <List component="nav" disablePadding>
          <ListItem button key={'リセット'}>
            <RotateLeftIcon />
            <ListItemText primary={'リセット'} onClick={handleReset} />
          </ListItem>
        </List>
      </Drawer>
    );
  } else {
    return (
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        variant="persistent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolBar} />
        <List component="nav" disablePadding>
          <ListItem button key={'データセット'} onClick={handleModalOpen}>
            <StorageIcon />
            <ListItemText primary={'データセット'} />
            <LaunchIcon />
          </ListItem>
          <ListItem button key={'リセット'}>
            <RotateLeftIcon />
            <ListItemText primary={'リセット'} onClick={handleReset} />
          </ListItem>
        </List>
      </Drawer>
    );
  }
};

export default DrawerWrapper;
