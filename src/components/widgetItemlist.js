import React from "react";
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { Typography, IconButton, Paper, makeStyles } from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GET_WIDGET_ITEMS } from "../graphql/queries";
import WidgetItem from "./widgetItem";
import { blue, grey } from "@material-ui/core/colors";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import { AlertContext } from "../contexts";
import WidgetForm from "./widgetform";
import { Update_Widget_Item_Order } from "../graphql/mutations";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    height: 250,
    width: 250,
    background: grey[300],
    position: "relative",
  },
  button: {
    position: "absolute",
    top: "25%",
    left: "25%",
  },
}));

const WidgetItemList = (props) => {
  const classes = useStyles();

  const snack = React.useContext(AlertContext);

  const client = useApolloClient();

  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_WIDGET_ITEMS,
    {
      variables: { widgetId: props?.widgetId },
      fetchPolicy: "network-only",
    }
  );

  const [open, setOpen] = React.useState(false);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    client
      .mutate({
        mutation: Update_Widget_Item_Order(
          reorder(
            data.allWidgetItems.nodes,
            result.source.index,
            result.destination.index
          )
        ),
      })
      .then((res) => {
        if (res) {
          snack.setSnack({
            open: true,
            msg: "Changes saved successfully!",
            severity: "success",
          });
          refetch();
          props?.reloadPreview();
        }
      })
      .catch((err) => {
        console.log(err);
        snack.setSnack({
          open: true,
          msg: "Some error occured,Please try again later!",
          severity: "error",
        });
      });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable_widget_item"
        direction="horizontal"
        style={{ padding: 10 }}
      >
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {(loading || networkStatus === 4) && (
              <Typography>Loading...</Typography>
            )}
            {error && <Typography>Loading...</Typography>}
            {data?.allWidgetItems?.nodes &&
              data?.allWidgetItems?.nodes?.map((item, index) => (
                <Draggable
                  key={`${item.name}-${item.id}`}
                  draggableId={`${item.name}-${item.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        float: "left",
                        backgroundColor: snapshot.isDragging
                          ? grey[300]
                          : "#fff",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <WidgetItem
                        id={`${item.name}-${item.id}`}
                        widgetId={props?.widgetId}
                        widgetType={props?.widgetType}
                        data={item}
                        provided={provided}
                        setOpen={setOpen}
                        refetch={refetch}
                        reloadPreview={props?.reloadPreview}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            <Draggable
              key={"add-widget-item"}
              draggableId={`add-widget-item`}
              index={data?.allWidgetItems?.nodes?.length + 1}
              isDragDisabled={true}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  style={{
                    padding: 5,
                    float: "left",
                    backgroundColor: snapshot.isDragging ? grey[300] : "#fff",
                    ...provided.draggableProps.style,
                  }}
                >
                  <div style={{ float: "left" }}>
                    <Paper elevation={2} className={classes.paper}>
                      <IconButton
                        className={classes.button}
                        onClick={() => setOpen(true)}
                      >
                        <AddCircleRoundedIcon
                          style={{ fontSize: 85, color: blue[200] }}
                        />
                      </IconButton>
                    </Paper>
                  </div>
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <WidgetForm
        open={open}
        type={"add"}
        widgetType={props?.widgetType}
        onClose={() => setOpen(false)}
        widgetId={props?.widgetId}
        length={data?.allWidgetItems?.nodes?.length}
        refetch={refetch}
        reloadPreview={props?.reloadPreview}
      />
    </DragDropContext>
  );
};

export default WidgetItemList;
