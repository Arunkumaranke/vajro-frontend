import React from "react";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import WidgetList from "./widgetlist";
import Preview from "./preview";
import { useQuery } from "@apollo/react-hooks";
import { PreviewQuery } from "../graphql/queries";

const useStyles = makeStyles((theme) => ({
  main: {
    margin: "50px",
  },
  paper: {
    flexGrow: 1,
    padding: 5,
  },
}));

export const Home = (props) => {
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(PreviewQuery);

  return (
    <Container className={classes.main}>
      <Grid container spacing={4} direction="row" alignItems="flex-start">
        <Grid item xs={10} container>
          <Grid item xs={12}>
            <Typography variant="h4">Customise your App</Typography>
          </Grid>
          <Grid item xs={12} className={classes.paper}>
            <WidgetList reloadPreview={refetch} />
          </Grid>
        </Grid>
        <Grid item xs={2} style={{ position: "relative" }}>
          <img src="./assets/iphone-mock.png" alt="preview" />
          <div
            style={{
              position: "absolute",
              top: 118,
              left: 44,
              maxWidth: 365,
              maxHeight: 648,
              overflow: "scroll",
              overflowX: "hidden",
            }}
          >
            <Preview data={data} loading={loading} error={error} />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};
