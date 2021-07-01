// ***********************************************************************
//
// This entry point seem to start from dynamic React server "start",
// and NOT from a pre-generated build.
//
// ***********************************************************************

import React from "react";
import ReactDOM from "react-dom";
import {Router} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store";
import "./i18n";
import Global from "./system/Global";
import {App} from "./app/App";
import InitEnvConfig from "./EnvConfig";
import "./index.scss";

let envConfig = InitEnvConfig();
Global.Initialize(envConfig);

let history = Global.GetPortal().getBrowserHistory();

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root"),
);
