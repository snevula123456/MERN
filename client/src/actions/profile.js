import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  CLEAR_PROFILE,
  GET_REPOS,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

// Get Current User Profie

export const getCurrentProfile = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get("/api/profile/me");
      console.log(res);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      console.log(err.message);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
};

// Get All Profiles
export const getProfiles = () => {
  return async (dispatch) => {
    dispatch({
      type: CLEAR_PROFILE,
    });
    try {
      const res = await axios.get("/api/profile");
      console.log(res);
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      console.log(err.message);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
};

// Get All Profiles by id
export const getProfileById = (userId) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`/api/profile/user/${userId}`);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      console.log(err.message);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
};
// Get GitHub repos
export const getGithubRepos = (username) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`/api/profile/github/${username}`);
      dispatch({
        type: GET_REPOS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
};

// Create or Update profile

export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/profile", formData, config);

    // console.log(res);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(
      setAlert(edit ? "Profile Update" : "Profile Created", "success", 5000)
    );

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.map((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Add Experience

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch(setAlert("Experience Added", "success", 5000));

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    console.log(res);
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    if (errors) {
      errors.map((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//  Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/education", formData, config);
    console.log(res);
    console.log(history);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Added", "success", 5000));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.map((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Delete experience

export const deleteExp = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Experience Removed", "success", 5000));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Delete education

export const deleteEdu = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Education Removed", "success", 5000));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Delete account in Profile

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? this can not be undone!")) {
    try {
      await axios.delete(`/api/profile`);
      dispatch({
        type: ACCOUNT_DELETED,
      });
      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch(
        setAlert("Your account has been permanently  Removed", "success", 5000)
      );
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  }
};
