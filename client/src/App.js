import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./components/Layout/Landing";
import Navbar from "./components/Layout/Navbar";
import Routes from "./components/routing/Routes";

import { Provider } from "react-redux";
import store from "./store";

import { loadUser } from "./actions/auth";
import setAutToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAutToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
