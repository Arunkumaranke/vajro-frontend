import React from "react";

import AppGQLClient from "./App.gql";
import AppAlert from "./App.alerts";
import { Home } from "./components";
import { CssBaseline } from "@material-ui/core";
import AppDialog from "./App.dailog";
import AppBackdrop from "./App.backdrop";

function App() {
  return (
    <AppGQLClient>
      <CssBaseline />
      <AppAlert>
        <AppDialog>
          <AppBackdrop>
            <Home />
          </AppBackdrop>
        </AppDialog>
      </AppAlert>
    </AppGQLClient>
  );
}

export default App;
