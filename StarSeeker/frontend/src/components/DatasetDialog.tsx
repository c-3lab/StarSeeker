import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PointDataset from './PointDataset';
import SurfaceDataset from './SurfaceDataset';
import Box from '@material-ui/core/Box';
import FormLabel from '@material-ui/core/FormLabel';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    box: {
      border: '1px solid #DDD',
      padding: theme.spacing(2),
      display: 'flex',
    },
    formLabel: {
      margin: theme.spacing(1),
      fontWeight: 'bold',
      textAlign: 'left',
    },
  })
);

type Props = {
  isOpenDatasetDialog: boolean;
  closeDialog: VoidFunction;
  check: string[];
  setCheck: Function;
  fetchPointData: Function;
  clearAllPointData: Function;
  fetchSurfaceData: Function;
  clearAllSurfaceData: Function;
};

function getColor(backgroundColor) {
  const r = parseInt(backgroundColor.substr(1, 2), 16) * 299;
  const g = parseInt(backgroundColor.substr(3, 2), 16) * 587;
  const b = parseInt(backgroundColor.substr(5, 2), 16) * 114;
  return (r + g + b) / 1000 < 128 ? 'white' : 'black';
}

const DatasetDialog: React.VFC<Props> = ({
  isOpenDatasetDialog,
  closeDialog,
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

  const body = (
    <>
      <DialogTitle>
        データセットを選択
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={closeDialog}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1}>
          {categories.map((data) => {
            return (
              <Grid key={data.name} item xs={12}>
                <Grid item xs={12} style={{ background: data.color }}>
                  <FormLabel
                    component="label"
                    className={classes.formLabel}
                    style={{ color: getColor(data.color) }}
                  >
                    {data.name}
                  </FormLabel>
                </Grid>
                <Box className={classes.box}>
                  <Grid container>
                    {data.pointDatasets.map((dataset) => (
                      <PointDataset
                        key={dataset.name}
                        dataset={dataset}
                        checked={check.includes(dataset.entityType)}
                        handleChangePointChecked={handleChangePointChecked}
                      />
                    ))}
                    {data.surfaceDatasets.map((dataset) => (
                      <SurfaceDataset
                        key={dataset.name}
                        dataset={dataset}
                        checked={check.includes(dataset.entityType)}
                        handleChangeSurfaceChecked={handleChangeSurfaceChecked}
                      />
                    ))}
                  </Grid>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </>
  );

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'lg'}
      open={isOpenDatasetDialog}
      onClose={closeDialog}
    >
      {body}
    </Dialog>
  );
};

export default DatasetDialog;
