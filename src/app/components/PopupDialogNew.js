import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import classnames from "classnames";
import {connect} from "react-redux";
import Popup from "reactjs-popup";
import Util from "src/core/Util";

import {ReactComponent as IconCancel} from "src/assets/icons/basic/close.svg";
import {scrollHelper} from "src/util/scrollUtils";
import {getTopIndex, reduceTopIndex} from "src/util/BrowserUtils";

const useStyles = makeStyles((theme) =>
  createStyles({
    disableButton: {
      cursor: "not-allowed",
      background: `${theme.palette.grey.disabled} !important`,
      "&:hover": {
        background: theme.palette.grey.disabled,
      },
      "& svg": {
        stroke: "#aaaaaa !important",
      },
    },
  }),
);

const connector = connect((state) => {
  return {};
}, {});

export const PopupDialogNew = connector(_PopupDialogNew);

function _PopupDialogNew(props) {
  const {
    open,
    customHeader,
    headerContent,
    showCloseIcon,
    children,
    contentStyle,
    onCancel,
    setCloseFunc,
    onClose,
    isLoading = false,
  } = props;

  const classes = useStyles();
  let titleComp = Util.IsString(headerContent) ? (
    <div className="title">{headerContent}</div>
  ) : (
    headerContent
  );

  let headerComp = (
    <React.Fragment>
      <div className="header">
        {showCloseIcon && (
          <span
            className={classnames(
              "icon cancel",
              isLoading && classes.disableButton,
            )}
            onClick={() => onCancel()}
          >
            <IconCancel />
          </span>
        )}
        {titleComp}
      </div>
    </React.Fragment>
  );

  let dialogContent = (
    <div>
      {customHeader || headerComp}

      <div className="content" style={{position: "relative"}}>
        {children}
      </div>
    </div>
  );

  // NOTE: follow example in: https://react-popup.elazizi.com/react-modal/
  // open state doesn't work. But using the close() function passed into
  // the children works!
  let comp = (
    <Popup
      contentStyle={contentStyle}
      open={open}
      closeOnDocumentClick={false}
      closeOnEscape={false}
      modal
      lockScroll={false}
      resetScroll
      position="center center"
      repositionOnResize
      onClose={() => {
        if (typeof onClose === "function") {
          onClose();
        }
        scrollHelper.unlock();
        reduceTopIndex();
      }}
      overlayStyle={{
        zIndex: open && getTopIndex(),
      }}
      {...props}
    >
      {(close) => {
        if (typeof setCloseFunc === "function") {
          setCloseFunc(() => close);
        }

        return dialogContent;
      }}
    </Popup>
  );
  return comp;
}
