import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PointsCategory from './PointsCategory';
import SurfacesCategory from './SurfacesCategory';
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
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'left',
    },
  })
);

type Props = {
  modalOpen: boolean;
  setModalOpen: Function;
  removeData: Function;
  check: string[];
  setCheck: Function;
  getEntityData: Function;
  getSurfaceData: Function;
  removeSurfaceData: Function;
};

const ModalForm: React.VFC<Props> = ({
  modalOpen,
  setModalOpen,
  removeData,
  check,
  setCheck,
  getEntityData,
  getSurfaceData,
  removeSurfaceData,
}) => {
  const classes = useStyles();
  const [datasets, setDatasets] = useState([]);
  useEffect(() => {
    async function getDatasets() {
      const ret = await axios.get('/api/datasets/datasets');
      setDatasets(ret.data);
    }
    getDatasets();
  }, []);

  const handlePointsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: number,
    entityType: string,
    iconColor: string
  ) => {
    if (check.includes(entityType)) {
      setCheck(check.filter((data) => data != entityType));
      removeData(datasetId);
    } else {
      setCheck([...check, entityType]);
      getEntityData(datasetId, iconColor);
    }
  };

  const handleSurfacesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: number,
    entityType: string,
    borderColor: string,
    fillColor: string
  ) => {
    if (check.includes(entityType)) {
      setCheck(check.filter((data) => data != entityType));
      removeSurfaceData(datasetId);
    } else {
      setCheck([...check, entityType]);
      getSurfaceData(datasetId, borderColor, fillColor);
    }
  };

  const handleClose = () => {
    setModalOpen(!modalOpen);
  };

  const body = (
    <>
      <DialogTitle>
        データセットを選択
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => handleClose()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1}>
          {datasets.map((data) => {
            return (
              <Grid key={data.categoryName} item xs={12}>
                <Grid item xs={12} style={{ background: data.categoryColor }}>
                  <FormLabel component="label" className={classes.formLabel}>
                    {data.categoryName}
                  </FormLabel>
                </Grid>
                <Box className={classes.box}>
                  <Grid container>
                    {data.pointDatasets.length !== 0 &&
                      data.pointDatasets.map((dataset) => {
                        return (
                          <PointsCategory
                            key={dataset.pointDatasetName}
                            datasetId={dataset.pointDatasetId}
                            name={dataset.pointDatasetName}
                            entityType={dataset.entityType}
                            check={check}
                            iconColor={dataset.pointColorCode}
                            handlePointsChange={handlePointsChange}
                          />
                        );
                      })}
                    {data.surfaceDatasets.length !== 0 &&
                      data.surfaceDatasets.map((dataset) => {
                        return (
                          <SurfacesCategory
                            key={dataset.surfaceDatasetName}
                            datasetId={dataset.surfaceDatasetId}
                            name={dataset.surfaceDatasetName}
                            entityType={dataset.entityType}
                            check={check}
                            borderColor={dataset.borderColorCode}
                            fillColor={dataset.fillColorCode}
                            handleSurfacesChange={handleSurfacesChange}
                          />
                        );
                      })}
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
      open={modalOpen}
      onClose={() => setModalOpen(!modalOpen)}
    >
      {body}
    </Dialog>
  );
};

export default ModalForm;
