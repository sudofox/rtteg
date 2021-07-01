import {Container, makeStyles} from "@material-ui/core";
import {PostSearchBoxNew} from "src/app/components/PostSearchBoxNew";
import {Logo} from "./Logo";
import UserMenu from "./UserMenu";
import {UserMenuGuest} from "./UserMenuGuest";
import {connect} from "react-redux";
import {useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router";

const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    position: "fixed",
    width: "100%",
    maxWidth: "none",
    padding: 0,
    margin: 0,
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.line.grey_2}`,
    zIndex: 10,
  },
  header: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1237,
    padding: 0,
  },
  logoWrapper: {
    width: theme.spacing(34.375),
    flexGrow: 0,
    flexShrink: 0,
    marginLeft: 0,
    [theme.breakpoints.down("md")]: {
      width: "auto",
      display: "flex",
      justifyContent: "flex-end",
      flexGrow: 1,
      marginRight: 0,
    },
    "&.hide": {
      display: "none",
    },
  },
  headerContent: {
    position: "relative",
    flexGrow: 2,
    [theme.breakpoints.only("md")]: {
      width: 860,
    },
    [theme.breakpoints.only("sm")]: {
      maxWidth: "100%",
      width: 600,
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
    },
  },
  headerContentRoot: {
    position: "relative",
    flexGrow: 1,
    flexWrap: "nowrap",
  },
  searchWrapper: {
    position: "relative",
    [theme.breakpoints.up("md")]: {
      minWidth: 600,
      maxWidth: 600,
    },
    [theme.breakpoints.down("md")]: {
      flexShrink: 1,
    },
    [theme.breakpoints.up("lg")]: {
      flexShrink: 0,
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: 600,
      width: "100%",
    },
    [theme.breakpoints.only("xs")]: {
      maxWidth: "100%",
      padding: theme.spacing(0, 2),
    },
  },
  userMenuWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.down("md")]: {
      flexShrink: 0,
      "@media (max-width: 1045px)": {
        // user menu is hidden behind scroll bar
        paddingRight: 20,
      },
    },
  },
}));

const connector = connect((state) => {
  return {
    authenticated: state.auth.session.authenticated,
    searchInputFocused: state.auth.global.searchInputFocused,
  };
}, {});

export const Header = connector(_Header);

export function _Header({authenticated, searchInputFocused}) {
  const classes = useStyles();
  const {pathname} = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  // const isTablet = useMediaQuery(theme.breakpoints.only("sm"));
  const isLaptop = useMediaQuery(theme.breakpoints.only("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [isSearchPage, setIsSearchPage] = useState(false);

  useEffect(() => {
    if (/search/i.test(pathname)) {
      setIsSearchPage(true);
    } else {
      setIsSearchPage(false);
    }
  }, [pathname]);

  return (
    <Container className={classes.headerWrapper}>
      <div className={classes.header}>
        <div
          className={`${classes.logoWrapper} ${
            isMobile && (searchInputFocused || isSearchPage) ? "hide" : ""
          }`}
        >
          <Logo />
        </div>
        <div className={classes.headerContent}>
          <Grid container className={classes.headerContentRoot}>
            <Grid item xs={12} md={8} lg={7} className={classes.searchWrapper}>
              <PostSearchBoxNew />
            </Grid>

            {(isLaptop || isDesktop) && (
              <Grid item md={4} lg={5} className={classes.userMenuWrapper}>
                {authenticated ? <UserMenu /> : <UserMenuGuest />}
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </Container>
  );
}
