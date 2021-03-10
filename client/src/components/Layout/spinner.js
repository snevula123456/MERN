import React, { Fragment } from "react";
import spin from "./spinner.gif";

const spinner = () => {
  return (
    <Fragment>
      <img
        src={spin}
        alt="loading..."
        style={{ width: "200px", margin: "auto", display: "block" }}
      />
    </Fragment>
  );
};

export default spinner;
