import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {LoginPageNew} from "src/app/pages/auth/LoginPageNew";
import {resetTimeline} from "src/store/modules/timeline";
import {NewUIPage} from "src/app/base/NewUIPage";
import Global from "src/system/Global";

const styles = (theme) => ({
  uiPage: {
    width: "100%",
    height: "100%",
  },
});

// /**
//  * Entry point /login
//  */
// class LoginRoute extends UIComponent {
//   constructor(props) {
//     super(props);

//     this.setClassname("Login");
//     // this.log("constructor", "Entering...");

//     // Declare this so that redirect will not take to login
//     this.setPublicPage();
//     this.state = {
//       pageTitle: "",
//       pageDescription: "",
//     };
//     this.setPageSeo = this.setPageSeo.bind(this);
//   }

//   componentDidMount() {
//     this.props.resetTimeline({
//       field: "postTimeline",
//     });
//   }

//   setPageSeo(title, description) {
//     if (title) {
//       this.setState({pageTitle: title});
//     }

//     if (description) {
//       this.setState({pageDescription: description});
//     }
//   }

//   render() {
//     const {classes} = this.props;

//     const portal = this.getPortal();

//     let comp = (
//       <UIPage
//         id="login-route"
//         // title={t("getter_fe.auth.login.seoTitle")}
//         // description={t("getter_fe.auth.login.seoDescription")}
//         title={this.state.pageTitle}
//         description={this.state.pageDescription}
//         className={classes.uiPage}
//       >
//         <AuthLayout
//           appContext={this.getAppContext()}
//           text={t("getter_fe.auth.common.layoutText")}
//         >
//           <LoginPageNew setPageSeo={this.setPageSeo} portal={portal} />
//         </AuthLayout>
//       </UIPage>
//     );
//     return comp;
//   }
// } // Login

export const NewLogin = () => {
  const dispatch = useDispatch();
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");

  useEffect(() => {
    dispatch(
      resetTimeline({
        field: "postTimeline",
      }),
    );
  }, []);

  const setPageSeo = (title, description) => {
    if (title) {
      setPageTitle(title);
    }

    if (description) {
      setPageDescription(description);
    }
  };

  const portal = Global.GetPortal();

  return (
    <NewUIPage title={pageTitle} description={pageDescription}>
      <LoginPageNew setPageSeo={setPageSeo} portal={portal} />
    </NewUIPage>
  );
};

const mapDispatchToProps = {
  resetTimeline,
};
// export default withStyles(styles)(
//   withRouter(connect(null, mapDispatchToProps)(LoginRoute)),
// );
