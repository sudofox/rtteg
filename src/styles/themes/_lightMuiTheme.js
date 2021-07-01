import {createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
  type: "light",
  breakpoints: {
    values: {
      xl: 1920,
      lg: 1366,
      md: 1002,
      sm: 600,
      xs: 0,
    },
  },
  palette: {
    primary: {
      dark: "#28255C",
      main: "#232255",
      light: "#BDBDCC",
    },
    secondary: {
      gray: "#737881",
      main: "#14171a",
      light: "#4B6181",
    },
    grey: {
      A1: "#333333",
      A3: "#828282",
      A6: "#F2F2F2",
      100: "#F9F9F9",
      A100: "#D7D7D7",
      A200: "#DFE1EA",
      A300: "#EEEFF3",
      A400: "#999999",
      A700: "#6E7187",
      A800: "#E8E9EA",
      disabled: "#D3D7DC",
    },
    text: {
      primary: "#000000",
      gray: "#5C7192",
      secondary: "#737881",
      light: "#a8a8a8", // #505050 opacity: 0.5
      disabled: "#FFFFFF",
      composer: "#657786",
      main: "#000",
      placeholder: "#5F7081",
      placeholderSecondary: "#6E7187",
      link: "#016EDC",
      lightGray: "#6e7187",
      user: "#4D6384",
    },
    background: {
      base: "#FCFDFD",
      default: "#ffffff",
      light: "#D3D7DC",
      dark: "#F9F9F9",
      gray: "#666666",
      transparent: "transparent",
      searchBox: "#5e779b",
      notif: "#F2F9FF",
      hover: "#3D3C7C",
      click: "#055DE1",
      black: "#000000",
      red: "#FFE7E8",
      button: {
        grey: {
          default: "#E4E4E4",
          hover: "#DBDDE3",
          disbale: "#E4E4E4",
          loading: "#E4E4E4",
        },
      },
    },
    error: {
      dark: "#BB0000",
      main: "#CC0000",
      secondary: "#CC0000",
      light: "#CC0000",
      background: "#FEF8F8",
    },
    buttonDanger: {
      dark: "#BB0000",
      main: "#CC0000",
      light: "#FA2C2C",
    },
    line: {
      grey_1: "#DFE1EA",
      grey_2: "#E8E9EF",
      grey_3: "#F5F5F5",
    },
  },
  typography: {
    h1: {
      fontSize: "22px",
      fontWeight: 900,
      lineHeight: "26.25px",
    },
    h2: {
      fontSize: "18px",
      fontWeight: 800,
      lineHeight: "21.48px",
    },
    body1: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "22.4px",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
    },
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "PingFang SC",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    fontWeightBolder: 800,
  },
  notchedOutline: {
    border: "1px solid #e3e9ee",
  },
  mixins: {
    app: {
      maxWidth: 1400,
    },
    header: {
      height: 61, // 60px + 1px border, due to box-sizing: border-box
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 999,
      fontWeight: 400,
      borderColor: "#E8E9EA",
    },
    ellipsis: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    dropdownMenu: {
      width: 240,
    },
    post: {
      shadow: "0px 0px 7px 6px rgba(0, 0, 0, 0.02)",
    },
  },
  zIndex: {
    header: 1000,
  },
  svg: {
    color: "#4B6386",
  },
  gradient: {
    dark: "linear-gradient(92.83deg, #00255C 10.77%, #073477 30.34%, #001F4E 85.91%)",
    main: "linear-gradient(91.95deg, #054AB1 9.58%, #0246AC 83.63%)",
    light: "linear-gradient(134.03deg, #016EDC 10.17%, #0364C5 100%)",
    danger: "linear-gradient(180deg, #DD1818 0%, #B80000 100%)",
    background:
      "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 4.03%, rgba(13, 13, 13, 0.32) 50.28%, rgba(0, 0, 0, 0) 98.51%)",
    overlay: "rgba(0, 0, 0, 0.9)",
  },
  input: {
    borderColor: "#DFE1EA",
    background: "#F8F9FB",
  },
  radio: {
    borderColor: "#A7B0BA",
  },
  divider: {
    color: "#C1C5D7",
  },
  blue: {
    light: "#016EDC",
    dark: "#0065FF",
    secondary: "#0A84FF",
    main: "#3261D8",
  },

  border: {
    lightGray: "#D3D3D3",
    inner: "#759FEC",
  },
  overrides: {
    MuiAvatar: {
      root: {
        textTransform: "uppercase",
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: "rgba(27, 27, 27, 0.9)",
      },
    },
    MuiDialog: {
      root: {
        zIndex: "9999 !important", // same as --popup-overlay-z-index
      },
    },
  },
});

export default theme;
