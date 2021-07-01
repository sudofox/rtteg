/**
 * Master Route definitions for Single Page Application (SPA) running
 * inside web browser's Javascript VM.  SSR routes are defined separately.
 *
 * The use of React Loable package is an attempt to associate routes
 * with different pre-build packages for on-demand, incremental loading.
 * Now, how well it works (e.g., how deep loading goes from dependency
 * of the routes is not clear to me and not tested right now).
 */

import React from "react";
import {Route, Switch} from "react-router-dom";
import {NewNotFound} from "./route-notfound";

import {Privacy} from "./route-privacy";
import {NewHashtag} from "./route-tag";
import {NewSearchResults} from "./route-search";
import {NewDashboard} from "./route-dashboard";
import {NewLogin} from "./route-login";
import {NewSignup} from "./route-signup";
import {NewLogout} from "./route-logout";
import {NewUserInfo} from "./route-userinfo";
import {NewUserNotExist} from "./route-usernotexist";
import {NewUserFollowing} from "./route-user-following";
import {NewUserFollowers} from "./route-user-followers";
import {NewPost} from "./route-post";
import {NewComment} from "./route-comment";
import {NewSettings} from "./route-settings-index";
import {NewHelpCenter} from "./route-help-center-index";
import {MobileAppHelpCenter} from "./route-mobile-app-help-center";
import {Terms} from "./route-terms";
import {NewTrending} from "./route-trending";
import {NewPopularUsers} from "./route-popular-users";
import {NewAccount} from "./route-account";
import {AdminTopicTrendsRoute} from "./route-admin-topic-trends";
import {ClaimRoute} from "./route-claim-callback";
import {ClaimErrorRoute} from "./route-claim-error";
import {NetworkFailed} from "./route-network-request-failed";
import {LayoutManager} from "../components/layout/LayoutManager";
import {MobilePermissionsBar} from "../components/MobilePermissionsBar";
import {GlobalPopupComponents} from "../components/GlobalPopupComponents";

// Routes with regularLayout
export const regularRoutes = [
  {path: "/", component: NewDashboard},
  {path: "/comment/:id", component: NewComment},
  {path: "/post/:id", component: NewPost},
  {path: "/hashtag/:id", component: NewHashtag},
  {path: "/search", component: NewSearchResults},
  {path: "/user/:id/:view?", component: NewUserInfo},
  {path: "/account-doesnt-exist/:id", component: NewUserNotExist},
  {path: "/trending", component: NewTrending},
  {path: "/popular-users", component: NewPopularUsers},
  {path: "/claim-failed", component: ClaimErrorRoute},
  {path: "/network-request-failed", component: NetworkFailed},
];

// Routes with authLayout
export const authRoutes = [
  {path: "/login", component: NewLogin},
  {path: "/claim", component: ClaimRoute},
  {path: "/signup", component: NewSignup},
];

// Routes with no standard layout
export const miscRoutes = [
  {path: "/settings/:tab", component: NewSettings},
  {path: "/helpcenter/:tab", component: NewHelpCenter},
  {path: "/helpcenter-app/:tab", component: MobileAppHelpCenter},
  {path: "/helpcenter-app", component: MobileAppHelpCenter},
  {path: "/account", component: NewAccount},
  {path: "/logout", component: NewLogout},
  {path: "/terms", component: Terms},
  {path: "/privacy", component: Privacy},
  {path: "/cookie-policy", component: Privacy},
  {path: "/terms-app", component: Terms},
  {path: "/privacy-app", component: Privacy},
  {path: "/cookie-policy-app", component: Privacy},
  {path: "/admin/topictrends", component: AdminTopicTrendsRoute},
];

const routes = [...regularRoutes, ...authRoutes, ...miscRoutes];

export default () => (
  <LayoutManager
    regularRoutes={regularRoutes}
    authRoutes={authRoutes}
    miscRoutes={miscRoutes}
  >
    <Switch>
      {routes.map(({path, component}, idx) => (
        <Route exact path={path} component={component} key={idx} />
      ))}
      <Route component={NewNotFound} />
    </Switch>
    <MobilePermissionsBar />
    <GlobalPopupComponents />
  </LayoutManager>
);
