import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./components/Layout/Landing";
import Navbar from "./components/Layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/Layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRouting from "./components/routing/PrivateRouting";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

// import axios from "axios";

import { Provider } from "react-redux";
import store from "./store";

import { loadUser } from "./actions/auth";
import setAutToken from "./utils/setAuthToken";

import "./App.css";

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
          <Route path="/" exact component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />
              <PrivateRouting exact path="/dashboard" component={Dashboard} />
              <PrivateRouting
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRouting
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRouting
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRouting
                exact
                path="/add-education"
                component={AddEducation}
              />

              <PrivateRouting exact path="/posts" component={Posts} />
              <PrivateRouting exact path="/posts/:id" component={Post} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
