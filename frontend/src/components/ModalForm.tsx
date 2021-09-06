import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Category from './Category';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
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
  const [datasets, setDatasets] = useState<[]>();
  // TODO 管理用DBからデータセット一覧を取得
  useEffect(() => {
    async function getDatasets() {
      const ret = await fetch('/api/datasets/types').then((res) => res.json());
      setDatasets(ret);
    }
    getDatasets();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    arg: string
  ) => {
    if (check.includes(event.target.name)) {
      setCheck(check.filter((d) => d !== event.target.name));
      removeData(arg);
    } else {
      setCheck([...check, event.target.name]);
      getEntityData(event.target.name);
    }
  };

  const handleClose = () => {
    setModalOpen(!modalOpen);
  };

  const body = (
    <>
      <DialogTitle>
        オープンデータを選択
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
          {typeof datasets !== 'undefined' &&
            datasets.map((data) => {
              return (
                <Category
                  key={data['type']}
                  name={data['type']}
                  check={check}
                  handleChange={handleChange}
                />
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
