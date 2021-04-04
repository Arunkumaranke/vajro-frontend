import React from "react";
import { AlertProps } from "../utils";

/**
 * AlertContext store the props which are neccessary to show the Alert component,
 * which is provided at the /src/App.js using the /src/App.alert.js.
 */
export let AlertContext = React.createContext({
  open: false,
  severity: AlertProps.severity.success,
  msg: "",
  vertical: AlertProps.vertical.top,
  horizontal: AlertProps.horizontal.center,
  onclose: () => null,
  setSnack: () => null,
});

/**
 * DialogContext store the props of a Dialog, which is provided at the /src/App.js using
 * the /src/App.dialog.js
 */
export let DialogContext = React.createContext({
  open: true,
  title: "",
  body: "",
  positiveBtn: "Ok",
  negativeBtn: "Cancel",
  onOk: () => null,
  setDialog: () => null,
});

/**
 * BackdropContext store the props of the Backdrop Component, which is provided at the /src/App.js using
 * the /src/App.backdrop.js
 */
export let BackdropContext = React.createContext({
  open: true,
  message: "",
  setBackDrop: () => null,
});
