import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    TextField,
    Typography,
    IconButton,
  } from "@material-ui/core";
  import React from "react";
  import { Add_Widget_Item, Update_Widget_Item } from "../graphql/mutations";
  import { AlertContext } from "../contexts";
  import { useApolloClient } from "@apollo/react-hooks";
  import PhotoCamera from "@material-ui/icons/PhotoCamera";
  import NetworkCall from "../networkcall";
  
  const useStyles = makeStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    input: {
      display: "none",
    },
  }));
  
  const WidgetForm = (props) => {
    const classes = useStyles();
  
    const snack = React.useContext(AlertContext);
  
    const client = useApolloClient();
  
    const [name, setName] = React.useState(props?.data?.name ?? "");
    const [imageUrl, setImageUrl] = React.useState(null);
    const [redirectUrl, setredirectUrl] = React.useState(
      props?.data?.redirectUrl ?? ""
    );
  
    const saveWidgetItem = () => {
      if (props?.type === "add") {
        let bodyFormData = new FormData();
        bodyFormData.set("file", imageUrl);
  
        if (imageUrl === null) {
          return;
        }
  
        NetworkCall.post("/imageupload", bodyFormData)
          .then((res) => {
            client
              .mutate({
                mutation: Add_Widget_Item,
                variables: {
                  name,
                  imageUrl: res.data.fileURL,
                  redirectUrl,
                  order: props?.length + 1,
                  widgetId: props?.widgetId,
                  time: new Date(),
                },
              })
              .then((res) => {
                setName("");
                setredirectUrl("");
                setImageUrl(null);
                snack.setSnack({
                  open: true,
                  msg: "Widget Item Added Successfully!",
                  severity: "success",
                });
                props.onClose();
                props.refetch();
                props?.reloadPreview();
              })
              .catch((error) => {
                throw error;
              });
          })
          .catch((error) => {
            console.log(error);
            snack.setSnack({
              open: true,
              msg: "Some error occured, Please try again!",
              severity: "error",
            });
          });
      }
  
      if (props?.type === "edit") {
        client
          .mutate({
            mutation: Update_Widget_Item,
            variables: {
              id: props?.data?.id,
              data: {
                name,
                redirectUrl,
              },
            },
          })
          .then((res) => {
            setName("");
            setredirectUrl("");
            setImageUrl(null);
            snack.setSnack({
              open: true,
              msg: "Widget Item Updated Successfully!",
              severity: "success",
            });
            props.onClose();
            props.refetch();
            props?.reloadPreview();
          })
          .catch((error) => {
            console.log(error);
            snack.setSnack({
              open: true,
              msg: "Some error occured, Please try again!",
              severity: "error",
            });
          });
      }
  
      if (props?.type === "upload") {
        let bodyFormData = new FormData();
        bodyFormData.set("file", imageUrl);
  
        if (imageUrl === null) {
          return;
        }
        NetworkCall.post("/imageupload", bodyFormData)
          .then((res) => {
            client
              .mutate({
                mutation: Update_Widget_Item,
                variables: {
                  id: props?.data?.id,
                  data: {
                    imageUrl: res.data.fileURL,
                  },
                },
              })
              .then((res) => {
                setImageUrl(null);
                snack.setSnack({
                  open: true,
                  msg: "Widget Item Added Successfully!",
                  severity: "success",
                });
                props.onClose();
                props.refetch();
                props?.reloadPreview();
              })
              .catch((error) => {
                throw error;
              });
          })
          .catch((error) => {
            console.log(error);
            snack.setSnack({
              open: true,
              msg: "Some error occured, Please try again!",
              severity: "error",
            });
          });
      }
    };
  
    return (
      <>
        <Dialog
          open={props.open}
          aria-labelledby="add-widget-item"
          onExit={() => {
            setName("");
            setredirectUrl("");
            setImageUrl("");
          }}
        >
          <DialogTitle
            id="add-widget-item"
            className={classes.root}
            disableTypography
          >
            <Typography>
              {props?.type === "add" ? "Add" : "Edit"} Widget Item
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ minWidth: 500 }}>
              {props?.widgetType === "Image" && props?.type !== "upload" && (
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Grid>
              )}
  
              {props?.type !== "upload" && (
                <Grid item xs={12}>
                  <TextField
                    label="Redirect Url"
                    fullWidth
                    variant="outlined"
                    name="redirectUrl"
                    value={redirectUrl}
                    onChange={(event) => setredirectUrl(event.target.value)}
                  />
                </Grid>
              )}
              {props?.type !== "edit" && (
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="icon-button-file"
                    type="file"
                    onChange={(event) => {
                      const files = event.target.files;
                      if (files) {
                        setImageUrl(files[0]);
                      }
                    }}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                    {imageUrl?.name}
                  </label>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={saveWidgetItem}>Save</Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  export default WidgetForm;
  