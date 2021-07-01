import {makeStyles} from "@material-ui/core";
import {GTypography} from "./GTypography";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2, 3),
    fontWeight: "bold",
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
  },
}));

export const GSectionHeader = ({title}) => {
  const classes = useStyles();
  return (
    <GTypography variant="h2" className={classes.header}>
      {title}
    </GTypography>
  );
};
