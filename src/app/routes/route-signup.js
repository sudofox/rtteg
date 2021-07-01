import React from "react";
import {SignupPageNew} from "src/app/pages/auth/SignupPageNew";
import {t} from "src/i18n/utils";
import {NewUIPage} from "src/app/base/NewUIPage";
import Global from "src/system/Global";

const styles = (theme) => ({
  uiPage: {
    width: "100%",
    height: "100%",
  },
});

// /**
//  * Entry point /signup
//  */
// class SignUp extends UIComponent {
//   constructor(props) {
//     super(props);

//     this.setClassname("Signup");

//     // Declare this so that redirect will not take to login
//     this.setPublicPage();

//     this.state = {
//       pageTitle: "",
//       pageDescription: "",
//     };
//     this.setPageSeo = this.setPageSeo.bind(this);
//   }

//   componentDidMount() {}

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
//         id="Signup-route"
//         title={t("getter_fe.auth.signup.seoTitle")}
//         description={t("getter_fe.auth.signup.seoDescription")}
//         className={classes.uiPage}
//       >
//         <AuthLayout
//           appContext={this.getAppContext()}
//           text={t("getter_fe.auth.common.layoutText")}
//         >
//           <SignupPageNew setPageSeo={this.setPageSeo} portal={portal} />
//         </AuthLayout>
//       </UIPage>
//     );
//     return comp;
//   }
// } // Login

export const NewSignup = () => {
  const portal = Global.GetPortal();

  return (
    <NewUIPage
      title={t("getter_fe.auth.signup.seoTitle")}
      description={t("getter_fe.auth.signup.seoDescription")}
    >
      <SignupPageNew portal={portal} />
    </NewUIPage>
  );
};

// export default withStyles(styles)(withRouter(SignUp));
