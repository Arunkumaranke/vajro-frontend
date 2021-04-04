import { gql } from "apollo-boost";

export let GET_WIDGETS = gql`
  query {
    allWidgets(orderBy: ORDER_ASC) {
      nodes {
        id
        name
        displayName
        order
        isActive
        widget_type: widgetTypeByWidgetTypeId {
          name: type
        }
      }
    }
  }
`;

export let GET_WIDGET_ITEMS = gql`
  query($widgetId: Int!) {
    allWidgetItems(condition: { widgetId: $widgetId }, orderBy: ORDER_ASC) {
      nodes {
        id
        imageUrl
        isActive
        name
        order
        redirectUrl
      }
    }
  }
`;

export let GET_WIDGET_WITH_ITEMS = gql`
  query($id: Int!) {
    widget: widgetById(id: $id) {
      name
      order
      displayName
      isActive
      widgetTypeId
      items: widgetItemsByWidgetId {
        nodes {
          name
          imageUrl
          redirectUrl
          order
          isActive
        }
      }
    }
  }
`;

export let PreviewQuery = gql`
  query {
    allWidgets(orderBy: ORDER_ASC, condition: { isActive: true }) {
      nodes {
        id
        name
        displayName
        type: widgetTypeByWidgetTypeId {
          name: type
        }
        items: widgetItemsByWidgetId(
          condition: { isActive: true }
          orderBy: ORDER_ASC
        ) {
          nodes {
            id
            name
            imageUrl
            redirectUrl
          }
        }
      }
    }
  }
`;
