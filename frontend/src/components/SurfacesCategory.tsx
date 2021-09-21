import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';

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
  datasetId: number;
  name: string;
  entityType: string;
  check: string[];
  borderColor: string;
  fillColor: string;
  handleSurfacesChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    datasetId: number,
    entityType: string,
    borderColor: string,
    fillColor: string
  ) => void;
};

const SurfacesCategory: React.VFC<Props> = ({
  datasetId,
  name,
  entityType,
  check,
  borderColor,
  fillColor,
  handleSurfacesChange,
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
                    checked={check.includes(entityType)}
                    onChange={(e) =>
                      handleSurfacesChange(
                        e,
                        datasetId,
                        entityType,
                        borderColor,
                        fillColor
                      )
                    }
                    name={name}
                  />
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

export default SurfacesCategory;
