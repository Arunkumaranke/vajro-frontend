import React from "react";
import {
  Paper,
  Grid,
  Button,
  makeStyles,
  ButtonGroup,
  Typography,
} from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { grey } from "@material-ui/core/colors";
import Image from "material-ui-image";
import { AlertContext, DialogContext } from "../contexts";
import { useApolloClient } from "@apollo/react-hooks";
import { Delete_Widget_Item } from "../graphql/mutations";
import WidgetForm from "./widgetform";

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    height: 250,
    width: 250,
    background: grey[500],
    position: "relative",
    "&:hover": {
      cursor: "move",
      boxShadow: `0px 6px 8px ${grey[500]}`,
    },
  },
  actions: {
    display: "inline-block",
    position: "absolute",
    bottom: 2,
    left: 5,
  },
  imageGrid: {
    position: "relative",
  },
  input: {
    display: "none",
  },
}));

const WidgetItem = (props) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");

  const dialog = React.useContext(DialogContext);
  const snack = React.useContext(AlertContext);

  const client = useApolloClient();

  const { id, data } = props;

  const deleteWidgetItem = (id) => {
    dialog.setDialog({
      open: true,
      title: "Delete Item",
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
            mutation: Delete_Widget_Item,
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

  return (
    <Grid item key={id} style={{ margin: 20 }}>
      <Paper
        elevation={2}
        className={classes.paper}
        {...props?.provided.dragHandleProps}
      >
        <div className={classes.imageGrid}>
          <Image
            src={data.imageUrl}
            alt={data.name}
            imageStyle={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className={classes.actions}>
          <div style={{ float: "left" }}>
            <ButtonGroup
              variant="contained"
              aria-label="contained primary button group"
            >
              <Button
                onClick={() => {
                  setOpen(true);
                  setType("upload");
                }}
              >
                Upload
              </Button>
              <Button
                onClick={() => {
                  setOpen(true);
                  setType("edit");
                }}
              >
                Edit
              </Button>
              <Button onClick={() => deleteWidgetItem(data?.id)}>
                <DeleteRoundedIcon />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Paper>
      <WidgetForm
        open={open}
        type={type}
        data={data}
        widgetType={props?.widgetType}
        onClose={() => setOpen(false)}
        widgetId={props?.widgetId}
        refetch={props?.refetch}
        reloadPreview={props?.reloadPreview}
      />
    </Grid>
  );
};

export default WidgetItem;
