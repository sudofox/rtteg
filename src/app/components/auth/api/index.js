import {login, login2} from "./login";
import {loginRefresh} from "./loginRefresh";
import {sendVerifCode} from "./sendVerifCode";
import {verifCode} from "./verifCode";
import {changePassword} from "./changePassword";
import {changeLoginStep} from "./changeLoginStep";
import {checkUsername} from "./checkUsername";
import {checkEmail} from "./checkEmail";
import {sendVerifCodeSignup} from "./sendVerifCodeSignup";
import {claimSignup} from "./claimSignup";
import {changeSignupStep} from "./changeSignupStep";
import {signup} from "./signup";
import {addPinPost} from "./addPinPost";
import {deletePinPost} from "./deletePinPost";

// TODO: prevent type widening
export const AuthApi = {
  login,
  login2,
  loginRefresh,
  sendVerifCode,
  verifCode,
  changePassword,
  changeLoginStep,
  checkUsername,
  checkEmail,
  sendVerifCodeSignup,
  claimSignup,
  changeSignupStep,
  signup,
  addPinPost,
  deletePinPost,
};
