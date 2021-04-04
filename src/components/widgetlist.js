import { Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React, { useContext } from "react";
import { useQuery, useApolloClient } from "react-apollo";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AlertContext } from "../contexts";
import { Update_Widget_Order } from "../graphql/mutations";
import { GET_WIDGETS } from "../graphql/queries";
import Widget from "./widgets";

/* const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
})); */

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const WidgetList = (props) => {
  //const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const customize = (panel) => {
    setExpanded(expanded === panel ? false : panel);
  };

  const client = useApolloClient();

  const snack = useContext(AlertContext);

  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_WIDGETS,
    {
      fetchPolicy: "network-only",
    }
  );

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
        mutation: Update_Widget_Order(
          reorder(
            data.allWidgets.nodes,
            result.source.index,
            result.destination.index
          )
        ),
      })
      .then((res) => {
        if (res) {
          snack.setSnack({
            open: true,
            msg: "Widget restored successfully!",
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
      <Droppable droppableId="dropable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {(loading || networkStatus === 4) && (
              <Typography>Loading...</Typography>
            )}
            {error && <Typography>Loading...</Typography>}
            {data?.allWidgets?.nodes?.length &&
              data?.allWidgets?.nodes?.map((item, index) => (
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
                        padding: 5,
                        paddingBottom: 15,
                        border: snapshot.isDragging
                          ? `5px dashed ${grey[500]}`
                          : "",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Widget
                        id={`${item.name}-${item.id}`}
                        data={item}
                        expanded={expanded}
                        handleCustomize={customize}
                        provided={provided}
                        refetch={refetch}
                        reloadPreview={props?.reloadPreview}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default WidgetList;
