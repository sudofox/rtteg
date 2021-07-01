import {createSlice, createAsyncThunk, createAction} from "@reduxjs/toolkit";
import {AuthApi} from "../api";
import {userConstants} from "../_constants";
import AppConsts from "../../../AppConsts";

const NS = "auth";

let user = JSON.parse(localStorage.getItem(userConstants.LS_SESSION_INFO));

const initialState = {
  session: user
    ? user
    : {
        authenticated: false,
        userinfo: {},
        error: false,
        isSuspended: false,
        isLoading: false,
      },
  signup: {
    error: false,
    success: false,
    isLoading: false,
  },
  sendVerifCode: {
    data: {},
    isLoading: false,
    error: false,
    success: false,
  },
  verifCode: {
    code: null,
    isLoading: false,
    error: false,
    success: false,
  },
  changePassword: {
    isLoading: false,
    error: false,
    success: false,
  },
  loginStep: {
    step: userConstants.STEP_LOGIN,
  },
  signupStep: {
    step: userConstants.STEP_SIGNUP,
  },
  claimStep: {
    imPost: true,
    username: "",
    claimed: false,
    autoConnect: true,
  },
  global: {
    searchInputFocused: false,
  },
};

export const login = createAsyncThunk("auth/login", AuthApi.login);
// export const login2 = createAsyncThunk("auth/login2", AuthApi.login2);

export const loginRefresh = createAsyncThunk(
  "auth/loginRefresh",
  AuthApi.loginRefresh,
);

export const sendVerifCode = createAsyncThunk(
  "auth/sendVerifCode",
  AuthApi.sendVerifCode,
);

export const sendVerifCodeSignup = createAsyncThunk(
  "auth/sendVerifCodeSignup",
  AuthApi.sendVerifCodeSignup,
);

export const claimSignup = createAsyncThunk(
  "auth/claimSignup",
  AuthApi.claimSignup,
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  AuthApi.changePassword,
);

export const verifCode = createAsyncThunk("auth/verifCode", AuthApi.verifCode);

export const changeLoginStep = createAsyncThunk(
  "auth/changeLoginStep",
  AuthApi.changeLoginStep,
);
export const changeSignupStep = createAsyncThunk(
  "auth/changeSignupStep",
  AuthApi.changeSignupStep,
);

export const checkUsername = createAsyncThunk(
  "auth/checkUsername",
  AuthApi.checkUsername,
);

export const checkEmail = createAsyncThunk(
  "auth/checkEmail",
  AuthApi.checkEmail,
);

export const addPinPost = createAsyncThunk(
  "auth/addPinPost",
  AuthApi.addPinPost,
);

export const deletePinPost = createAsyncThunk(
  "auth/deletePinPost",
  AuthApi.deletePinPost,
);

export const signup = createAsyncThunk("auth/signup", AuthApi.signup);

export const resetSessionStatus = createAction(`${NS}/resetSessionStatus`);

export const resetSendVerifCodeStatus = createAction(
  `${NS}/resetSendVerifCodeStatus`,
);

export const resetVerifCodeStatus = createAction(`${NS}/resetVerifCodeStatus`);

export const resetchangePasswordStatus = createAction(
  `${NS}/resetchangePasswordStatus`,
);
export const logout = createAction(`${NS}/logout`);

export const changeImpost = createAction(`${NS}/changeImpost`);
export const changeAutoConnect = createAction(`${NS}/changeAutoConnect`);
export const setClaimUsername = createAction(`${NS}/setClaimUsername`);
export const setClaimed = createAction(`${NS}/setClaimed`);

export const setGlobalSearchInputFocused = createAction(
  `${NS}/setGlobalSearchInputFocused`,
);

export const setSessionUserLanguage = createAction(
  `${NS}/setSessionUserLanguage`,
);

export const authSlice = createSlice({
  name: NS,
  initialState,
  reducers: {
    changeImpost: (state, {payload}) => {
      state.claimStep.imPost = payload.imPost;
    },
    changeAutoConnect: (state, {payload}) => {
      state.claimStep.autoConnect = payload.autoConnect;
    },
    setClaimUsername: (state, {payload}) => {
      state.claimStep.username = payload.username;
    },
    setClaimed: (state, {payload}) => {
      state.claimStep.claimed = payload.claimed;
    },
    resetSessionStatus: (state) => {
      state.session.error = false;
      state.session.isLoading = false;
      state.session.isSuspended = false;
    },
    resetSendVerifCodeStatus: (state) => {
      state.sendVerifCode.error = false;
      state.sendVerifCode.isLoading = false;
      state.sendVerifCode.success = false;
    },
    resetVerifCodeStatus: (state) => {
      state.verifCode.code = null;
      state.verifCode.error = false;
      state.verifCode.isLoading = false;
      state.verifCode.success = false;
    },
    resetchangePasswordStatus: (state) => {
      state.changePassword.error = false;
      state.changePassword.isLoading = false;
      state.changePassword.success = false;
    },
    refreshUserInfo: (state, {payload}) => {
      payload.userinfo.token = state.session.userinfo.token;
      state.session.userinfo = payload.userinfo;
      localStorage.setItem(
        userConstants.LS_SESSION_INFO,
        JSON.stringify(state.session),
      );
    },
    logout: (state, payload) => {
      state.session.authenticated = false;
      state.session.userinfo = {};
    },
    setGlobalSearchInputFocused: (state, {payload}) => {
      state.global.searchInputFocused = payload;
    },
    setSessionUserLanguage: (state, {payload}) => {
      state.session.userinfo.lang = payload;
      localStorage.setItem(
        userConstants.LS_SESSION_INFO,
        JSON.stringify(state.session),
      );
      localStorage.setItem(AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG, payload);
    },
  },
  extraReducers: (builder) => {
    // Doc: https://redux-toolkit.js.org/usage/usage-with-typescript#type-safety-with-extrareducers

    builder.addCase(login.pending, (state) => {
      state.session.authenticated = false;
      state.session.isLoading = true;
      state.session.error = false;
    });

    builder.addCase(login.fulfilled, (state, {payload}) => {
      state.session.isLoading = false;

      if (!payload) {
        state.session.isLoading = false;
        state.session.error = true;
        return;
      }

      if (payload && payload.userinfo === "E_USER_SUSPENDED") {
        state.session.isSuspended = true;
        return;
      }

      if (payload && !payload.authenticated) {
        state.session.error = true;
        return;
      }

      state.session.authenticated = payload.authenticated;
      state.session.userinfo = payload.userinfo;
    });

    builder.addCase(login.rejected, (state) => {
      state.session.authenticated = false;
      state.session.isLoading = false;
      state.session.error = true;
    });

    builder.addCase(loginRefresh.fulfilled, (state, {payload}) => {
      if (payload) {
        state.session.authenticated = payload.authenticated;
        state.session.userinfo = payload.userinfo;
      }
    });

    builder.addCase(sendVerifCode.pending, (state) => {
      state.sendVerifCode.success = false;
      state.sendVerifCode.error = false;
      state.sendVerifCode.isLoading = true;
    });

    builder.addCase(sendVerifCode.fulfilled, (state, {payload}) => {
      if (payload) {
        state.sendVerifCode.data.email = payload;
        state.sendVerifCode.success = true;
      } else {
        state.sendVerifCode.error = true;
      }

      state.sendVerifCode.isLoading = false;
    });

    builder.addCase(sendVerifCode.rejected, (state) => {
      state.sendVerifCode.success = false;
      state.sendVerifCode.error = true;
      state.sendVerifCode.isLoading = false;
    });

    builder.addCase(sendVerifCodeSignup.pending, (state) => {
      state.sendVerifCode.success = false;
      state.sendVerifCode.error = false;
      state.sendVerifCode.isLoading = true;
    });

    builder.addCase(sendVerifCodeSignup.fulfilled, (state, {payload}) => {
      if (payload) {
        state.sendVerifCode.data = payload;
        state.sendVerifCode.success = true;
      } else {
        state.sendVerifCode.error = true;
      }

      state.sendVerifCode.isLoading = false;
    });

    builder.addCase(sendVerifCodeSignup.rejected, (state) => {
      state.sendVerifCode.success = false;
      state.sendVerifCode.error = true;
      state.sendVerifCode.isLoading = false;
    });

    builder.addCase(verifCode.pending, (state) => {
      state.verifCode.success = false;
      state.verifCode.error = false;
      state.verifCode.isLoading = true;
    });

    builder.addCase(verifCode.fulfilled, (state, {payload}) => {
      if (payload) {
        state.verifCode.code = payload;
        state.verifCode.success = true;
      } else {
        state.verifCode.error = true;
      }

      state.verifCode.isLoading = false;
    });

    builder.addCase(verifCode.rejected, (state) => {
      state.verifCode.success = false;
      state.verifCode.error = true;
      state.verifCode.isLoading = false;
    });

    builder.addCase(changePassword.pending, (state) => {
      state.changePassword.success = false;
      state.changePassword.error = false;
      state.changePassword.isLoading = true;
    });

    builder.addCase(changePassword.fulfilled, (state, {payload}) => {
      payload
        ? (state.changePassword.success = true)
        : (state.changePassword.error = true);

      state.changePassword.isLoading = false;
    });

    builder.addCase(changePassword.rejected, (state) => {
      state.changePassword.success = false;
      state.changePassword.error = true;
      state.changePassword.isLoading = false;
    });

    builder.addCase(changeLoginStep.fulfilled, (state, {payload}) => {
      if (payload) {
        state.loginStep.step = payload;
      }
    });

    builder.addCase(changeSignupStep.fulfilled, (state, {payload}) => {
      if (payload) {
        state.signupStep.step = payload;
      }
    });

    builder.addCase(signup.pending, (state) => {
      state.signup.success = false;
      state.signup.error = false;
      state.signup.isLoading = true;
    });

    builder.addCase(signup.fulfilled, (state, {payload}) => {
      if (payload) {
        state.signup.success = true;
      } else {
        state.signup.error = true;
      }

      if (payload && !payload.authenticated) {
        state.session.error = true;
        return;
      }

      state.session.authenticated = payload.authenticated;
      state.session.userinfo = payload.userinfo;

      state.signup.isLoading = false;
    });

    builder.addCase(signup.rejected, (state) => {
      state.signup.success = false;
      state.signup.error = true;
      state.signup.isLoading = false;
    });

    builder.addCase(addPinPost.fulfilled, (state, {payload}) => {
      if (Array.isArray(payload)) {
        let pinnedPosts = payload.toString();
        pinnedPosts = '["' + pinnedPosts + '"]';

        let userInfo = {...state.session.userinfo};
        userInfo.pinpsts = pinnedPosts;
        state.session.userinfo = userInfo;

        localStorage.setItem(
          userConstants.LS_SESSION_INFO,
          JSON.stringify(state.session),
        );
      }
    });

    builder.addCase(deletePinPost.fulfilled, (state, {payload}) => {
      if (Array.isArray(payload)) {
        let pinnedPosts = payload.toString();

        let userInfo = {...state.session.userinfo};
        userInfo.pinpsts = pinnedPosts;
        state.session.userinfo = userInfo;

        localStorage.setItem(
          userConstants.LS_SESSION_INFO,
          JSON.stringify(state.session),
        );
      }
    });
  },
});

export const {refreshUserInfo} = authSlice.actions;
