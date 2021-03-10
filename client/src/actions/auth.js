import axios from "axios";
import setAutToken from "../utils/setAuthToken";
import {
  REGISTER_SUCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
import { setAlert } from "./alert";

// Load User

export const loadUser = () => async (dispatch) => {
  // if localstorage token is available then setting it to axios headers
  if (localStorage.token) {
    setAutToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User

export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("/api/users", body, config);
    console.log(res);
    dispatch({
      type: REGISTER_SUCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    if (errors) {
      errors.map((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }
    console.log(err.message);
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    console.log("reducer started");
    const res = await axios.post("/api/auth", body, config);
    console.log(res);
    dispatch({
      type: LOGIN_SUCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response.data.errors);
    if (errors) {
      errors.map((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }
    console.log(err.message);
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout or Clear the Token from the LocalStorage

export const logout = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: LOGOUT,
  });
};
