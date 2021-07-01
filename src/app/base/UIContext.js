import React, {useEffect, useState} from "react";
import getTheme from "../../styles/themes";
import {ThemeProvider} from "@material-ui/core";
import Global from "src/system/Global";

const UIContext = React.createContext({
  currentTheme: "light",
  setTheme: null,
});

const THEME = "current_theme";
const DEFAULT = "light";

export const MuiThemeProvider = ({children}) => {
  const appService = Global.GetPortal().getAppService();
  const currentTheme = appService.getSessionVar(THEME) || DEFAULT;
  const [themeName, _setThemeName] = useState(currentTheme);
  const setThemeName = (name) => {
    appService.setSessionVar(THEME, name);
    _setThemeName(name);
  };

  const theme = getTheme(themeName);

  useEffect(() => {
    // sets background color for entire site
    document.body.style.backgroundColor = theme.palette.background.base;
  }, []);

  const contextValue = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };
  return (
    <UIContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </UIContext.Provider>
  );
};

export default UIContext;
