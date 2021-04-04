import React from "react";
import {
  Button,
  Collapse,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import DragIndicatorRoundedIcon from "@material-ui/icons/DragIndicatorRounded";
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { grey } from "@material-ui/core/colors";
import WidgetItemList from "./widgetItemlist";
import { useApolloClient } from "react-apollo";
import { AlertContext, DialogContext } from "../contexts";
import {
  Clone_Widget,
  Delete_Widget,
  Update_Widget,
} from "../graphql/mutations";
import { GET_WIDGET_WITH_ITEMS } from "../graphql/queries";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 5,
  },
  details: {
    margin: 0,
    padding: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  tableRow: {
    "& > *": {
      borderBottom: "unset",
    },
  },
}));

const Widget = (props) => {
  const classes = useStyles();

  const dialog = React.useContext(DialogContext);
  const snack = React.useContext(AlertContext);

  var { id, data, expanded, handleCustomize } = props;

  const client = useApolloClient();

  const deleteWidget = (id) => {
    dialog.setDialog({
      open: true,
      title: "Delete Widget",
      body: (
        <Typography variant="body1">
          You're about to delete a widget. Are you sure you want to delete it?
        </Typography>
      ),
      positiveBtn: "Sure",
      negativeBtn: "Cancel",
      onOk: () => {
        client
          .mutate({
            mutation: Delete_Widget,
            variables: { id },
          })
          .then((_) => {
            snack.setSnack({
              open: true,
              msg: "Widget Deleted Sucessfully!",
              severity: "success",
            });
            dialog.setDialog({ open: false });
            props?.refetch();
            props?.reloadPreview();
          });
      },
    });
  };

  const [displayName, setDisplayName] = React.useState(data?.displayName || "");

  const updateWidgetVisibility = (id) => {
    client
      .mutate({
        mutation: Update_Widget,
        variables: { id, data: { isActive: !data?.isActive } },
      })
      .then((_) => {
        props?.refetch();
        props?.reloadPreview();
      })
      .catch((err) => console.log(err));
  };

  const updateDisplayName = (id) => {
    client
      .mutate({
        mutation: Update_Widget,
        variables: { id, data: { displayName } },
      })
      .then((_) => {
        snack.setSnack({
          open: true,
          msg: "Title updated successfully!",
        });
      })
      .catch((err) => console.log(err));
  };

  const cloneWidget = (id) => {
    client
      .query({ query: GET_WIDGET_WITH_ITEMS, variables: { id } })
      .then((res) => {
        if (res?.data) {
          let widgetItems = res?.data?.widget?.items?.nodes?.map((i) => {
            return {
              id: i.id,
              imageUrl: i.imageUrl,
              isActive: i.isActive,
              name: i.name,
              order: i.order,
              redirectUrl: i.redirectUrl,
            };
          });
          client
            .mutate({
              mutation: Clone_Widget,
              variables: {
                ...res?.data?.widget,
                widgetItems,
              },
            })
            .then((_) => {
              props?.refetch();
              props?.reloadPreview();
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <TableContainer
      component={Paper}
      style={{ flexGrow: 1, overflow: "hidden" }}
    >
      <Table padding="none">
        <TableBody>
          <TableRow className={classes.tableRow}>
            <TableCell
              {...props?.provided.dragHandleProps}
              align="center"
              padding="none"
            >
              <DragIndicatorRoundedIcon
                style={{ color: grey[500], fontSize: 40 }}
              />
            </TableCell>
            <TableCell align="left" padding="none">
              <Typography variant="h5" align="left">
                {data.name}
              </Typography>
            </TableCell>
            <TableCell align="right" padding="none">
              <Tooltip arrow title="Clone Widget">
                <IconButton
                  aria-label="clone"
                  onClick={() => cloneWidget(data?.id)}
                >
                  <FileCopyRoundedIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip arrow title="Delete Widget">
                <IconButton
                  aria-label="delete"
                  onClick={() => deleteWidget(data?.id)}
                >
                  <DeleteRoundedIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => updateWidgetVisibility(data?.id)}
              >
                {data?.isActive ? "Hide" : "Show"}
              </Button>
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => handleCustomize(id)}
              >
                Customize
              </Button>
            </TableCell>
          </TableRow>
          {expanded === id && (
            <TableRow>
              <TableCell style={{ padding: 5, flexGrow: 1 }} colSpan={3}>
                <Collapse in={expanded === id} timeout="auto" unmountOnExit>
                  <Grid
                    container
                    spacing={2}
                    className={classes.root}
                    direction="row"
                    alignItems="center"
                    justify="center"
                  >
                    {(data?.widget_type?.name === "Product" ||
                      data?.widget_type?.name === "Instagram") && (
                      <Grid item xs={12} style={{ margin: 5 }}>
                        <TextField
                          label="Title"
                          variant="outlined"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          size="small"
                          style={{ margin: 1 }}
                        />
                        <Button
                          onClick={() => updateDisplayName(data?.id)}
                          variant="contained"
                          color="primary"
                          size="medium"
                          style={{ margin: 1 }}
                        >
                          Save
                        </Button>
                      </Grid>
                    )}
                    <Grid item container xs={12} style={{ margin: 5 }}>
                      <WidgetItemList
                        widgetId={data?.id}
                        widgetType={data?.widget_type?.name}
                        reloadPreview={props?.reloadPreview}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Widget;
