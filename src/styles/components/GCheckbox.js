import React from "react";
import {Checkbox} from "@material-ui/core";

export const GCheckbox = ({className, ...rest}) => {
  return (
    <Checkbox disableRipple={true} className={className} {...rest}></Checkbox>
  );
};
