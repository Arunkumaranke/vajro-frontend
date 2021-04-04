import gql from "graphql-tag";

export let Update_Widget_Order = (data) => gql`
  mutation {
    ${data.map(
      (
        item,
        index
      ) => `body${index}:updateWidgetById(input: { widgetPatch: { order: ${
        index + 1
      } }, id: ${item.id} }) {
        clientMutationId
      }`
    )}
  }
`;

export let Delete_Widget = gql`
  mutation($id: Int!) {
    deleteWidgetById(input: { id: $id }) {
      deletedWidgetId
    }
  }
`;

export let Update_Widget = gql`
  mutation($id: Int!, $data: WidgetPatch!) {
    updateWidgetById(input: { id: $id, widgetPatch: $data }) {
      clientMutationId
    }
  }
`;

export let Clone_Widget = gql`
  mutation(
    $name: String
    $order: Int!
    $widgetTypeId: Int!
    $widgetItems: [WidgetItemsWidgetIdFkeyWidgetItemsCreateInput!]
    $displayName: String
  ) {
    createWidget(
      input: {
        widget: {
          name: $name
          order: $order
          widgetTypeId: $widgetTypeId
          widgetItemsUsingId: { create: $widgetItems }
          isActive: true
          displayName: $displayName
        }
      }
    ) {
      clientMutationId
    }
  }
`;

export let Add_Widget_Item = gql`
  mutation(
    $name: String
    $imageUrl: String
    $order: Int!
    $widgetId: Int!
    $redirectUrl: String
    $time: Datetime!
  ) {
    createWidgetItem(
      input: {
        widgetItem: {
          createdAt: $time
          updatedAt: $time
          imageUrl: $imageUrl
          isActive: true
          name: $name
          order: $order
          redirectUrl: $redirectUrl
          widgetId: $widgetId
        }
      }
    ) {
      clientMutationId
    }
  }
`;

export let Update_Widget_Item_Order = (data) => gql`
  mutation {
    ${data.map(
      (
        item,
        index
      ) => `body${index}:updateWidgetItemById(input: { widgetItemPatch: { order: ${
        index + 1
      } }, id: ${item.id} }) {
        clientMutationId
      }`
    )}
  }
`;

export let Delete_Widget_Item = gql`
  mutation($id: Int!) {
    deleteWidgetItemById(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export let Update_Widget_Item = gql`
  mutation($data: WidgetItemPatch!, $id: Int!) {
    updateWidgetItemById(input: { widgetItemPatch: $data, id: $id }) {
      clientMutationId
    }
  }
`;
