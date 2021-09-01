import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      border: '1px solid #DDD',
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    formLabel: {
      color: '#000000',
      fontWeight: 'bold',
    },
  })
);

type Props = {
  modalOpen: boolean;
  setModalOpen: Function;
  sendData: Function;
  removeData: Function;
  check: string[];
  setCheck: Function;
};

type Args = {
  category: string;
  type: string;
};

const ModalForm: React.VFC<Props> = ({
  modalOpen,
  setModalOpen,
  sendData,
  removeData,
  check,
  setCheck,
}) => {
  const classes = useStyles();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    args: Args
  ) => {
    if (check.includes(event.target.name)) {
      setCheck(check.filter((d) => d !== event.target.name));
      removeData(args);
      setModalOpen(!modalOpen);
    } else {
      setCheck([...check, event.target.name]);
      sendData(args);
      setModalOpen(!modalOpen);
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
          <Grid item xs={3}>
            <Box className={classes.box}>
              <FormControl component="fieldset">
                <FormLabel component="label" className={classes.formLabel}>
                  医療機関
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <CheckBox
                        color="primary"
                        checked={check.includes('hospital')}
                        onChange={(e) =>
                          handleChange(e, { category: '1', type: '1' })
                        }
                        name="hospital"
                      />
                    }
                    label="病院"
                  />
                  <FormControlLabel
                    control={
                      <CheckBox
                        color="primary"
                        checked={check.includes('dentalClinic')}
                        onChange={(e) =>
                          handleChange(e, { category: '1', type: '2' })
                        }
                        name="dentalClinic"
                      />
                    }
                    label="歯科医院"
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box className={classes.box}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.formLabel}>
                  公共施設
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <CheckBox
                        color="primary"
                        checked={check.includes('fireDepartment')}
                        onChange={(e) =>
                          handleChange(e, { category: '2', type: '1' })
                        }
                        name="fireDepartment"
                      />
                    }
                    label="消防署"
                  />
                  <FormControlLabel
                    control={
                      <CheckBox
                        color="primary"
                        checked={check.includes('policeStation')}
                        onChange={(e) =>
                          handleChange(e, { category: '2', type: '2' })
                        }
                        name="policeStation"
                      />
                    }
                    label="警察署"
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box className={classes.box}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.formLabel}>
                  公園
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <CheckBox
                        color="primary"
                        checked={check.includes('park')}
                        onChange={(e) =>
                          handleChange(e, { category: '3', type: '1' })
                        }
                        name="park"
                      />
                    }
                    label="公園"
                  />
                </FormGroup>
              </FormControl>
            </Box>
          </Grid>
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
