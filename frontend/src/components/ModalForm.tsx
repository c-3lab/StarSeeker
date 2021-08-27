import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      top: '20%',
      left: '25%',
      position: 'absolute',
      width: '55%',
      height: '60%',
      backgroundColor: theme.palette.background.paper,
      border: '1px #000',
      padding: theme.spacing(0, 3, 3),
    },
    root: {
      flexGrow: 1,
    },
    formControl: {
      margin: theme.spacing(3),
    },
    grid: {
      margin: 0.1,
    },
    box: {
      margin: 'auto',
      border: '1px solid #DDD',
      width: '300px',
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

  const body = (
    <div className={classes.paper}>
      <div>
        <h4>オープンデータを選択</h4>
      </div>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item className={classes.grid}>
            <Box className={classes.box}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">医療機関</FormLabel>
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
          <Grid item className={classes.grid}>
            <Box className={classes.box}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">公共施設</FormLabel>
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
          <Grid item className={classes.grid}>
            <Box className={classes.box}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">公園</FormLabel>
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
      </div>
    </div>
  );

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(!modalOpen)}>
      {body}
    </Modal>
  );
};

export default ModalForm;
