import React from "react";
import {useHistory} from "react-router-dom";
import {ClaimPage} from "./ClaimPage";

export const Claim = () => {
  const history = useHistory();
  let denied = new URLSearchParams(window.location.search).get("denied");
  if (denied) {
    history.push("/signup");
    return null;
  } else {
    return (
      <>
        <ClaimPage />
      </>
    );
  }
};

export default Claim;
