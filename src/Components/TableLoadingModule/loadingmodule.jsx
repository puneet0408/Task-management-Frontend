import React from "react";
import { TbChecks } from "react-icons/tb";
import "./loadingmodule.scss";

const LoadingModule = () => {
  return (
    <div className="loading-wrapper">

      {/* logo */}
      <div className="loading-logo">
        <TbChecks size={26} />
      </div>

      {/* brand name */}
      <p className="loading-brand">Sprintly</p>

      {/* dots */}
      <div className="loading-dots">
        <span />
        <span />
        <span />
      </div>

      <p className="loading-text">Loading your data...</p>

    </div>
  );
};

export default LoadingModule;