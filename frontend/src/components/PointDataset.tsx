import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      border: '1px solid #DDD',
      padding: theme.spacing(1),
      margin: 1,
      display: 'flex',
    },
    formLabel: {
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    icon: {
      margin: theme.spacing(1),
    },
  })
);

type Props = {
  dataset: any;
  checked: boolean;
  handleChangePointChecked: (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: number,
    name: string,
    iconColor: string
  ) => void;
};

const PointDataset: React.VFC<Props> = ({
  dataset,
  checked,
  handleChangePointChecked,
}) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Box className={classes.box}>
        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <>
                  <CheckBox
                    color="primary"
                    checked={checked}
                    onChange={(e) =>
                      handleChangePointChecked(
                        e,
                        dataset.id,
                        dataset.entityType,
                        dataset.color
                      )
                    }
                    name={dataset.entityType}
                  />
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    color={dataset.color}
                    className={classes.icon}
                  />
                </>
              }
              label={dataset.name}
            />
          </FormGroup>
        </FormControl>
      </Box>
    </Grid>
  );
};

export default PointDataset;
