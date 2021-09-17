import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Category from './Category';
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
  check: { [key: string]: number }[];
  setCheck: Function;
  getEntityData: Function;
};

const ModalForm: React.VFC<Props> = ({
  modalOpen,
  setModalOpen,
  removeData,
  check,
  setCheck,
  getEntityData,
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: { [key: string]: number },
    iconColor: string
  ) => {
    if (
      check.some(
        (data) =>
          Object.keys(data)[0] === Object.keys(datasetId)[0] &&
          Object.values(data)[0] === Object.values(datasetId)[0]
      )
    ) {
      const hoge = check.filter(
        (data) =>
          !(
            Object.keys(data)[0] === Object.keys(datasetId)[0] &&
            Object.values(data)[0] === Object.values(datasetId)[0]
          )
      );
      setCheck(
        check.filter(
          (data) =>
            !(
              Object.keys(data)[0] === Object.keys(datasetId)[0] &&
              Object.values(data)[0] === Object.values(datasetId)[0]
            )
        )
      );
      removeData(datasetId);
    } else {
      setCheck([...check, datasetId]);
      getEntityData(datasetId, iconColor);
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
                        const datasetId: { [key: string]: number } = {
                          pointDatasetId: dataset.pointDatasetId,
                        };
                        console.log(datasetId)
                        return (
                          <Category
                            key={dataset.pointDatasetName}
                            datasetId={datasetId}
                            name={dataset.pointDatasetName}
                            check={check}
                            iconColor={dataset.pointColorCode}
                            handleChange={handleChange}
                          />
                        );
                      })}
                    {data.surfaceDatasets.length !== 0 &&
                      data.surfaceDatasets.map((dataset) => {
                        const datasetId: { [key: string]: number } = {
                          surfaceDatasetId: dataset.surfaceDatasetId,
                        };
                        return (
                          <Category
                            key={dataset.surfaceDatasetName}
                            datasetId={datasetId}
                            name={dataset.surfaceDatasetName}
                            check={check}
                            iconColor={dataset.fillColorCode}
                            handleChange={handleChange}
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
