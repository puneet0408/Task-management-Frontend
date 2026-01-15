import React from "react";
import "./loadingmodule.scss";

const LoadingModule = () => {
  return (
    <div className="loading-wrapper">
      {/* <img
        src="https://illustrations.popsy.co/gray/loading.svg"
        alt="Loading"
        className="loading-img"
      /> */}
      <p className="loading-text">Loading your data...</p>
    </div>
  );
};

export default LoadingModule;
