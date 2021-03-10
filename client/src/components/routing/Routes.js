import React from "react";
import { Route, Switch } from "react-router";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Alert from "../Layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import PrivateRouting from "../routing/PrivateRouting";
import CreateProfile from "../profile-forms/CreateProfile";
import EditProfile from "../profile-forms/EditProfile";
import AddExperience from "../profile-forms/AddExperience";
import AddEducation from "../profile-forms/AddEducation";
import Profiles from "../profiles/Profiles";
import Profile from "../profile/Profile";
import Posts from "../posts/Posts";
import Post from "../post/Post";
import NotFound from "../Layout/NotFound";

const Routes = (props) => {
  return (
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
        <PrivateRouting exact path="/edit-profile" component={EditProfile} />
        <PrivateRouting
          exact
          path="/add-experience"
          component={AddExperience}
        />
        <PrivateRouting exact path="/add-education" component={AddEducation} />

        <PrivateRouting exact path="/posts" component={Posts} />
        <PrivateRouting exact path="/posts/:id" component={Post} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
