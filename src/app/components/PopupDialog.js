import React from "react";
import PropTypes from "prop-types";

import Popup from "reactjs-popup";
import Util from "../../core/Util";
import {ReactComponent as IconCancel} from "src/assets/icons/basic/close.svg";

const WINDOW_OPEN_POPUP_DIALOG = "windowOpenPopupDialog";
const PROP_HAS_MOUNTED = "hasMounted";

/**
 * Implementation of a Popup Dialog that is also
 * by default a Modal window.
 *
 * See PropTypes below for expected prooperties.
 * Each button can be passed-in, and each can
 * be shown.
 */
class PopupDialog extends React.Component {
  constructor(props) {
    super(props);
    //this.setClassname("PopDlg");

    // NOTE: using "controlled modal" doesn't work with open boolean
    this.state = {open: this.props.open != null ? this.props.open : false};

    this.closeAction = this.closeAction.bind(this);
    this.openAction = this.openAction.bind(this);
    this.onOK = this.onOK.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onHelp = this.onHelp.bind(this);
    this.onDoNothing = this.onDoNothing.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
  }

  /**
   * Do Nothing... used to "absorb" auto firing
   * of a button event that have not been
   * debugged yet (as of 8/16/2019)
   *
   * @param {*} event
   */
  onDoNothing(event) {
    // this.log("onDN", "Entering...");
    event.preventDefault();
  }

  onCancel(event) {
    // this.log("onCancel", "Entering...");
    event.preventDefault();

    this.closeWindow();
  }

  onOK(event) {
    // this.log("onOK", "Entering...");
    event.preventDefault();
    if (this.props.doneAction) {
      this.props.doneAction();
    }
    this.closeWindow();
  }

  onHelp(event) {
    // this.log("onHelp", "Entering...");
    event.preventDefault();
  }

  /**
   * Close window. Closing requires
   * the closing function passed into
   * the children of the <Popup>
   */
  closeWindow() {
    //this.setState({ open: false });

    if (this.closeFunc) {
      let closeFunc = this.closeFunc;
      this.closeFunc = null;
      closeFunc();
    }
  }

  /**
   * Not tested
   * @param {*} e
   */
  openWindow(event) {
    //this.setState({ open: true });
  }

  openAction(e) {
    e.stopPropagation();
    if (!this.props.userInfo) {
      this.props.history.push("/login");
    } else {
      window[WINDOW_OPEN_POPUP_DIALOG] = true;
      this.props[PROP_HAS_MOUNTED] && this.props[PROP_HAS_MOUNTED]();
    }
    if (this.props.onOpen != null) this.props.onOpen();
  }

  closeAction(event) {
    if (this.props.onClose != null) this.props.onClose();

    this.closeWindow();

    window[WINDOW_OPEN_POPUP_DIALOG] = false;
  }

  getDoNothingButton() {
    if (this.doNothingButton == null)
      this.doNothingButton = (
        <button
          style={{visibility: "hidden"}}
          onClick={this.onDoNothing}
        ></button>
      );
    return this.doNothingButton;
  }

  getResetButton() {
    return this.props.resetButton;
  }

  getCancelButton() {
    if (this.props.cancelButton) return this.props.cancelButton;

    if (this.cancelButton == null) {
      let cancelText = this.props.cancelText ? this.props.cancelText : "Cancel";
      this.cancelButton = (
        <React.Fragment>
          <button className="button-outline" onClick={this.onCancel}>
            {cancelText}
          </button>
          &nbsp;
        </React.Fragment>
      );
    }
    return this.cancelButton;
  }

  getOkButton() {
    if (this.props.okButton) return this.props.okButton;

    if (this.okButton == null) {
      let okText = this.props.okText ? (
        this.props.okText
      ) : (
        <span>&nbsp;&nbsp;OK&nbsp;&nbsp;</span>
      );
      this.okButton = (
        <React.Fragment>
          <button onClick={this.onOK}>{okText}</button>&nbsp;
        </React.Fragment>
      );
    }
    return this.okButton;
  }

  getHelpButton() {
    if (this.props.helpButton) return this.props.helpButton;

    if (this.helpButton == null) {
      let helpText = this.props.helpText ? this.props.helpText : "Help";
      this.helpButton = (
        <React.Fragment>
          <button onClick={this.onHelp}>{helpText}</button>&nbsp;
        </React.Fragment>
      );
    }
    return this.helpButton;
  }

  render() {
    let hasReset = this.props.hasReset ? this.props.hasReset : false;
    let hasCancel = this.props.hasCancel ? this.props.hasCancel : false;
    let hasOk = this.props.hasOk ? this.props.hasOk : true;
    let hasHelp = this.props.helpContent ? true : false;
    let needDN = this.props.needDoNothing ? this.props.needDoNothing : false;
    let customHeader = this.props.customHeader;

    let doNothingButton = needDN ? this.getDoNothingButton() : null;
    let resetButton = hasReset ? this.getResetButton() : null;
    let cancelButton = hasCancel ? this.getCancelButton() : null;
    let okButton = hasOk ? this.getOkButton() : null;
    let helpButton = hasHelp ? this.getHelpButton() : null;

    let headerContent = this.props.headerContent;
    // this.log("render", " header: ", headerContent);
    let titleComp = Util.IsString(headerContent) ? (
      <div className="title">{headerContent}</div>
    ) : (
      headerContent
    );

    let headerComp = (
      <React.Fragment>
        <div className="header">
          {this.props.showCloseIcon && (
            <span className="icon cancel" onClick={this.onCancel}>
              <IconCancel />
            </span>
          )}
          {titleComp}
        </div>
      </React.Fragment>
    );

    let actionGroup = (
      <div className="action-groups">
        {needDN ? doNothingButton : null}
        {hasCancel ? cancelButton : null}
        {hasReset ? resetButton : null}
        {hasOk ? okButton : null}
        {hasHelp ? helpButton : null}
      </div>
    );

    let dialogContent = (
      <div>
        {customHeader || headerComp}

        <div className="content" style={{position: "relative"}}>
          {this.props.children}
        </div>

        {/* {actionGroup} */}
      </div>
    );

    // NOTE: follow example in: https://react-popup.elazizi.com/react-modal/
    // open state doesn't work. But using the close() function passed into
    // the children works!
    let comp = (
      <Popup
        contentStyle={this.props.contentStyle}
        open={this.props.open}
        onClose={this.closeAction}
        onOpen={this.openAction}
        closeOnDocumentClick={!this.props.isLoading}
        closeOnEscape={true}
        modal={true}
        lockScroll={false}
        resetScroll={true}
        position="center center"
        repositionOnResize={true}
        {...this.props}
      >
        {(close) => {
          this.closeFunc = close;
          return dialogContent;
        }}
      </Popup>
    );
    return comp;
  }
}

PopupDialog.propTypes = {
  appContext: PropTypes.object,
  parentComp: PropTypes.object,
  trigger: PropTypes.object.isRequired,
  needDoNothing: PropTypes.bool /* absorb the auto-fire button event */,
  hasOk: PropTypes.bool,
  hasCancel: PropTypes.bool,
  hasReset: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  helpText: PropTypes.string,
  helpContent: PropTypes.object,
  headerContent: PropTypes.any,
  separator: PropTypes.object,
  actionGroupStyle: PropTypes.object,
  okButton: PropTypes.object,
  resetbutton: PropTypes.object,
  cancelButton: PropTypes.object,
  helpButton: PropTypes.object,
  onCancel: PropTypes.func,
  contentStyle: PropTypes.object,
  [PROP_HAS_MOUNTED]: PropTypes.func,
  customHeader: PropTypes.any,
  showCloseIcon: PropTypes.bool,
};

export default PopupDialog;
