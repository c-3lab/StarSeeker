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
  datasetId: { [key: string]: number };
  name: string;
  check: { [key: string]: number }[];
  iconColor: string;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: { [key: string]: number },
    iconColor: string
  ) => void;
};

const Category: React.VFC<Props> = ({
  datasetId,
  name,
  check,
  iconColor,
  handleChange,
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
                    checked={check.some(
                      (data) =>
                        Object.keys(data)[0] == Object.keys(datasetId)[0] &&
                        Object.values(data)[0] === Object.values(datasetId)[0]
                    )}
                    onChange={(e) => handleChange(e, datasetId, iconColor)}
                    name={name}
                  />
                  {Object.keys(datasetId)[0].startsWith('point') && (
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      color={iconColor}
                      className={classes.icon}
                    />
                  )}
                </>
              }
              label={name}
            />
          </FormGroup>
        </FormControl>
      </Box>
    </Grid>
  );
};

export default Category;
