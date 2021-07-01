import React from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {FormControl, Typography} from "@material-ui/core";
import GAxios from "src/util/GAxios";
import {GTextField} from "../../../styles/components/GTextField";
import {GButton} from "../../../styles/components/GButton";
import {Formik} from "formik";
import clsx from "clsx";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(4.375),
      fontSize: 28,
      lineHeight: "33px",
      fontWeight: 600,
      color: theme.palette.text.main,
    },
    formControl: {
      marginTop: 0,
      marginBottom: theme.spacing(2.5),
    },
    inputField: {
      "& input:not([type=checkbox]):not([type=radio])": {
        fontSize: 18,
        fontWeight: 400,
      },
    },
    inputFieldError: {
      "& fieldset": {
        borderWidth: 2,
        borderColor: theme.palette.error.light,
      },
    },
    btn: {
      height: theme.spacing(6),
      margin: theme.spacing(0, 0, 5, 0),
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
  }),
);

export const TopicTrendsPage = (props) => {
  const classes = useStyles();
  const {t} = useTranslation();

  const initialData = {
    content: props.content,
  };

  const getFinalData = (data) => {
    let b = data.content.replace(/\n/g, "");

    let result = `{"content":{"values":${b}}}`;
    return result;
  };

  const handleSubmit = async (data) => {
    let finalData = getFinalData(data);
    await deleteData();
    const config = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/admin/config/trending/hashtags`,
      data: finalData,
    };

    try {
      await GAxios(config);
    } catch (error) {
      console.warn(error);
    } finally {
      window.location.reload();
    }
  };

  const deleteData = async () => {
    let finalData = {
      content: {
        values: {...initialData.content},
      },
    };

    await GAxios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/admin/config/trending/hashtags`,
      data: finalData,
    });
  };

  const syntaxHighlight = (json) => {
    if (json === null || json === undefined) return;
    if (typeof json != "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return match;
      },
    );
  };

  return (
    <div>
      <Typography variant="h1" component="h2" className={classes.title}>
        {t("getter_fe.auth.signup.createYourAccount")}
      </Typography>
      <div style={{fontSize: "20px"}}>
        <pre>{syntaxHighlight(props.content)}</pre>
      </div>

      <Formik
        initialValues={{
          content: props.content,
        }}
        onSubmit={({content}, {setSubmitting}) => {
          setSubmitting(false);
          handleSubmit({content});
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            isValid,
            isSubmitting,
            dirty,
            setFieldTouched,
          } = props;
          let initStr = JSON.stringify(initialData.content);
          initStr = initStr && initStr.replace(/},/g, "},\n");

          return (
            <form className="form" onSubmit={handleSubmit}>
              <FormControl
                fullWidth
                margin="dense"
                className={classes.formControl}
              >
                <GTextField
                  id="content"
                  multiline
                  type="text"
                  name="content"
                  rows={40}
                  onChange={handleChange}
                  className={clsx(
                    classes.inputField,
                    Boolean(touched.topic && errors.topic) &&
                      classes.inputFieldError,
                  )}
                  label={`${t("getter_fe.common.trends.topic")}`}
                  disabled={isSubmitting}
                />
              </FormControl>

              <GButton
                type="submit"
                variant="contained"
                className={classes.btn}
                disabled={Boolean(isSubmitting)}
                loading={isSubmitting}
              >
                {t("getter_fe.post.button.confirm")}
              </GButton>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
